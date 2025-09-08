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
    print("📥 Incoming request data:", data)  # ✅ Debug incoming payload
    
    division_id = data.get('division_id')
    yearly_data = data.get('division_brsr_report_yearly', [])
    
    if not yearly_data:
        return jsonify({"error": "No report data provided"}), 400
    
    # Use the first record (for now)
    report_data = yearly_data[0]
    print("📦 Extracted yearly report data:", report_data)  # ✅ Debug yearly data
    
    reporting_month = report_data.get('reporting_month')   # DATE field
    avg_complaint_count = report_data.get('avg_complaint_count')  # ✅ correct key
    print("🗓 Reporting Month:", reporting_month)
    print("📊 Avg Complaint Count:", avg_complaint_count)
    
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
        insert_values = (
            division_id,
            reporting_month,   # DATE (e.g., "2025-08-01")
            report_data.get('avg_energy_kwh'),
            report_data.get('avg_energy_bill'),
            report_data.get('avg_fuel_litres'),
            report_data.get('avg_paper_reams'),
            report_data.get('avg_waste_kg'),
            report_data.get('avg_water_litres'),
            report_data.get('avg_training_hours'),
            avg_complaint_count,  # ✅ fixed (no space in key)
            1,  # branches_count (placeholder)
            current_user['user_id']
        )
        print("📝 Insert values:", insert_values)  # ✅ Debug values before insert
        
        cur.execute("""
            INSERT INTO brsr_reports 
            (district_id, reporting_month, avg_energy_kwh, total_energy_bill, 
             avg_fuel_litres, avg_paper_reams, total_waste_kg, avg_water_litres,
             total_training_hours, avg_complaint_count, branches_count, generated_by, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'submitted')
        """, insert_values)
        
        conn.commit()
        
        return jsonify({
            "message": "Report submitted successfully",
            "report_id": cur.lastrowid,
            "reporting_month": reporting_month,
            "avg_complaint_count": avg_complaint_count
        })
        
    except Exception as e:
        conn.rollback()
        print("❌ Error inserting report:", str(e))  # ✅ Debug error
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
        
@bp.route('/check-submission-status', methods=['GET'])
@token_required
def check_submission_status(current_user):
    division_id = request.args.get('division_id')
    
    if not division_id:
        return jsonify({"error": "division_id is required"}), 400
    
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    
    try:
        # Check if this division has already submitted a report
        cur.execute("""
            SELECT status, created_at 
            FROM brsr_reports 
            WHERE district_id = %s 
            ORDER BY created_at DESC 
            LIMIT 1
        """, (division_id,))
        
        latest_report = cur.fetchone()
        
        if latest_report and latest_report['status'] == 'submitted':
            return jsonify({
                "has_submitted": True,
                "last_submission_date": latest_report['created_at'].isoformat() if latest_report['created_at'] else None
            })
        else:
            return jsonify({"has_submitted": False})
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()