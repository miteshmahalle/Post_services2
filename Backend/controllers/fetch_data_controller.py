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
    
    # Use the first year's data (assuming one year per request)
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
        
        # Merge division info with report data
        full_report_data = {**division_info, **report_data}
        
        # 2. Generate PDF (using year instead of reporting_month)
        # pdf_path = generate_pdf_report(full_report_data, year)
        
        # 3. Store report metadata in database (without reporting_month)
        cur.execute("""
            INSERT INTO brsr_reports 
            (district_id, avg_energy_kwh, total_energy_bill, 
             avg_fuel_litres, avg_paper_reams, total_waste_kg, avg_water_litres,
             total_training_hours, branches_count, generated_by, file_path, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'submitted')
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
            current_user['user_id'],
            # pdf_path
        ))
        
        conn.commit()
        
        return jsonify({
            "message": "Report generated successfully",
            # "pdf_url": f"/api/reports/{os.path.basename(pdf_path)}",
            "report_id": cur.lastrowid
        })
        
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# def generate_pdf_report(data, year):
#     # Create PDF using reportlab or weasyprint
#     # Use year instead of reporting_month in the filename
#     filename = f"BRSR_Report_{data['division_id']}_{year}.pdf"
#     save_path = os.path.join('reports', filename)
    
#     # Example with reportlab
#     from reportlab.lib.pagesizes import letter
#     from reportlab.pdfgen import canvas
    
#     c = canvas.Canvas(save_path, pagesize=letter)
#     c.drawString(100, 750, f"BRSR Report - {data['division_name']}")
#     c.drawString(100, 730, f"Reporting Year: {year}")  # Changed from Period to Year
#     c.drawString(100, 710, f"Manager: {data['manager_name']}")
    
#     # Add all your data fields...
#     y_position = 690
#     c.drawString(100, y_position, f"Average Energy Consumption (kWh): {data.get('avg_energy_kwh', 'N/A')}")
#     y_position -= 20
#     c.drawString(100, y_position, f"Average Energy Bill: {data.get('avg_energy_bill', 'N/A')}")
#     y_position -= 20
#     c.drawString(100, y_position, f"Average Fuel Consumption (Liters): {data.get('avg_fuel_litres', 'N/A')}")
#     y_position -= 20
#     c.drawString(100, y_position, f"Average Paper Consumption (Reams): {data.get('avg_paper_reams', 'N/A')}")
#     y_position -= 20
#     c.drawString(100, y_position, f"Average Waste Generated (kg): {data.get('avg_waste_kg', 'N/A')}")
#     y_position -= 20
#     c.drawString(100, y_position, f"Average Water Consumption (Liters): {data.get('avg_water_litres', 'N/A')}")
#     y_position -= 20
#     c.drawString(100, y_position, f"Average Training Hours: {data.get('avg_training_hours', 'N/A')}")
#     y_position -= 20
#     c.drawString(100, y_position, f"Average Complaints Count: {data.get('avg_complaints_count', 'N/A')}")
    
#     c.save()
    
#     return save_path

# @bp.route('/reports/<filename>', methods=['GET'])
# def download_report(filename):
#     token = request.args.get('token')
    
#     if not token:
#         return jsonify({"error": "Token required"}), 401
        
#     # Verify token (you'll need to implement this)
#     current_user = verify_token(token)
#     if not current_user or current_user['role'] not in ['division', 'circle']:
#         return jsonify({"error": "Unauthorized"}), 403
    
#     file_path = os.path.join('reports', filename)
    
#     if not os.path.exists(file_path):
#         return jsonify({"error": "Report not found"}), 404
    
#     return send_file(file_path, as_attachment=True)

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
                br.file_path,
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