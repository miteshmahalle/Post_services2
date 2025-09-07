# controllers/fetch_data_controller.py
import os
from flask import Blueprint, jsonify, request, send_file
import mysql.connector
from functools import wraps
import jwt

# ✅ Import config
import config

SECRET_KEY = config.SECRET_KEY
bp = Blueprint('fetch_data', __name__, url_prefix="/api/fetch_data")

def get_db_connection():
    return mysql.connector.connect(**config.DB_CONFIG)

# ---------------- HELPER: TOKEN REQUIRED ----------------
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            try:
                token = request.headers['Authorization'].split(" ")[1]  # Bearer <token>
            except:
                return jsonify({"error": "Invalid token format"}), 401

        if not token:
            return jsonify({"error": "Token is missing!"}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = {
                "user_id": data["user_id"],
                "branch_id": data["branch_id"],
                "role": data["role"]
            }
        except Exception as e:
            return jsonify({"error": "Token is invalid!", "details": str(e)}), 401

        return f(current_user, *args, **kwargs)
    return decorated

# ---------------- GET BRANCHES/DIVISIONS LIST ----------------
@bp.route('/branches/list', methods=['GET'])
@token_required
def get_branches_list(current_user):
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    
    try:
        if current_user['role'] == 'division':
            # Get branches under this division
            cur.execute("""
                SELECT branch_id, branch_code, branch_name, manager_name, phone
                FROM branches 
                WHERE parent_id = %s AND level = 'branch'
                ORDER BY branch_name
            """, (current_user['branch_id'],))
        
        elif current_user['role'] == 'circle':
            # Get divisions under this circle
            cur.execute("""
                SELECT branch_id, branch_code, branch_name, manager_name, phone
                FROM branches 
                WHERE parent_id = %s AND level = 'division'
                ORDER BY branch_name
            """, (current_user['branch_id'],))
        
        else:
            return jsonify({"error": "Unauthorized role"}), 403
        
        branches = cur.fetchall()
        return jsonify({"branches": branches})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# ---------------- GET ALL DATA FOR ADMIN VIEW (Optional) ----------------
@bp.route('/all-branches', methods=['GET'])
@token_required
def get_all_branches(current_user):
    # Only allow circle officers to see all branches
    if current_user['role'] != 'circle':
        return jsonify({"error": "Unauthorized"}), 403
    
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    
    try:
        cur.execute("""
            SELECT 
                b.branch_id, 
                b.branch_code, 
                b.branch_name, 
                b.manager_name, 
                b.email, 
                b.phone, 
                b.address, 
                b.pincode, 
                b.state,
                p.branch_name as parent_name
            FROM branches b
            LEFT JOIN branches p ON b.parent_id = p.branch_id
            ORDER BY b.branch_name
        """)
        
        branches = cur.fetchall()
        return jsonify({"branches": branches})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# Add to your fetch_data_controller.py or create a new report_controller.py
# Add to your fetch_data_controller.py or create a new report_controller.py
@bp.route('/generate-report', methods=['POST'])
@token_required
def generate_report(current_user):
    if current_user['role'] not in ['division', 'circle']:
        return jsonify({"error": "Unauthorized role"}), 403
    
    data = request.get_json()
    division_id = data.get('division_id')
    yearly_data = data.get('division_brsr_report_yearly', [])
    
    if not yearly_data:
        return jsonify({"error": "No yearly data provided"}), 400
    
    # Use the first year's data
    report_data = yearly_data[0]
    year = report_data.get('year')
    
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    
    try:
        # 1. Fetch division details
        cur.execute("""
            SELECT 
                b.branch_id as division_id,
                b.branch_name as division_name,
                b.manager_name,
                b.phone,
                b.email,
                b.address
            FROM branches b
            WHERE b.branch_id = %s
        """, (division_id,))
        
        division_info = cur.fetchone()
        
        if not division_info:
            return jsonify({"error": "Division not found"}), 404
        
        # 2. Store report metadata in database (without file_path)
        cur.execute("""
            INSERT INTO brsr_reports 
            (district_id, avg_energy_kwh, total_energy_bill, 
             avg_fuel_litres, avg_paper_reams, total_waste_kg, avg_water_litres,
             total_training_hours, branches_count, generated_by, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'submitted')
        """, (
            division_id,
            report_data.get('avg_energy_kwh'),
            report_data.get('avg_energy_bill'),
            report_data.get('avg_fuel_litres'),
            report_data.get('avg_paper_reams'),
            report_data.get('avg_waste_kg'),
            report_data.get('avg_water_litres'),
            report_data.get('avg_training_hours'),
            # You might need to calculate branches_count differently
            1,  # Placeholder - adjust as needed
            current_user['user_id']
        ))
        
        conn.commit()
        
        return jsonify({
            "message": "Report submitted successfully",
            "report_id": cur.lastrowid
        })
        
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@bp.route('/submitted-reports', methods=['GET'])
@token_required
def get_submitted_reports(current_user):
    if current_user['role'] != 'circle':
        return jsonify({"error": "Unauthorized - Only circle officers can view reports"}), 403
    
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    
    try:
        cur.execute("""
            SELECT 
                br.report_id,
                br.district_id,
                b.branch_name as division_name,
                b.manager_name,
                b.phone,
                br.created_at,
                u.username as generated_by_user
            FROM brsr_reports br
            JOIN branches b ON br.district_id = b.branch_id
            LEFT JOIN users u ON br.generated_by = u.user_id
            WHERE br.status = 'submitted'
            ORDER BY br.created_at DESC
        """)
        
        reports = cur.fetchall()
        return jsonify({"reports": reports})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()