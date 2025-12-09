# controllers/dashboard_controller.py
from flask import Blueprint, jsonify, request
import datetime
import mysql.connector
from functools import wraps
import jwt

# ✅ Import full config
import config
SECRET_KEY = config.SECRET_KEY

bp = Blueprint('dashboard', __name__, url_prefix="/api/dashboard")


def get_db_connection():
    return mysql.connector.connect(
    host=config.DB_CONFIG['host'],
    user=config.DB_CONFIG['user'],
    password=config.DB_CONFIG['password'],
    database=config.DB_CONFIG['database'],
    port=config.DB_CONFIG['port']
    )


# -----------------------------
# Helper: JWT authentication
# -----------------------------
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            try:
                token = request.headers["Authorization"].split(" ")[1]  # "Bearer <token>"
            except Exception:
                return jsonify({"error": "Malformed Authorization header"}), 401

        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(data, *args, **kwargs)

    return decorated


# ===========================
# Branch Dashboard
@bp.route('/branch', methods=['GET'])
@token_required
def branch_dashboard(user):
    if user['role'] != 'branch':
        return jsonify({"error": "Unauthorized"}), 403

    branch_id = user['branch_id']
    current_year = datetime.date.today().year

    # Generate months list
    months = []
    for m in range(1, 12 + 1):
        month_date = datetime.date(current_year, m, 1)
        months.append({
            "name": month_date.strftime("%B"),
            "value": month_date.strftime("%Y-%m"),
            "submitted": False
        })

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    try:
        # Fetch submitted reports with enhanced query
        query = """
            SELECT DISTINCT DATE_FORMAT(reporting_month, %s) AS month_key
            FROM esg_data
            WHERE branch_id = %s AND YEAR(reporting_month) = %s
            ORDER BY month_key
        """
        
        cur.execute(query, ('%Y-%m', branch_id, current_year))
        results = cur.fetchall()
        
        # Create set of submitted months
        submitted = {row['month_key'] for row in results}

        # Alternative approach - also try with string conversion for safety
        if not submitted:
            cur.execute("""
                SELECT DISTINCT DATE_FORMAT(reporting_month, %s) AS month_key
                FROM esg_data
                WHERE CAST(branch_id AS CHAR) = %s AND YEAR(reporting_month) = %s
                ORDER BY month_key
            """, ('%Y-%m', str(branch_id), current_year))
            
            alt_results = cur.fetchall()
            if alt_results:
                submitted = {row['month_key'] for row in alt_results}

    except Exception as e:
        submitted = set()
    finally:
        cur.close()
        conn.close()

    # Mark submitted months
    for month in months:
        if month["value"] in submitted:
            month["submitted"] = True

    return jsonify({
        "branch_id": branch_id,
        "year": current_year,
        "months": months
    })


# ===========================
# Division Dashboard
# ===========================
@bp.route('/division', methods=['GET'])
@token_required
def division_dashboard(user):
    if user['role'] != 'division':
        return jsonify({"error": "Unauthorized"}), 403

    division_id = user['branch_id']
    current_year = datetime.date.today().year

    print("📌 Division Dashboard Called")
    print(f"➡️ User Division ID from token: {division_id}")
    print(f"➡️ Current Year: {current_year}")

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    try:
        # ✅ Fetch submitted division ESG reports (fix applied: single %)
        cur.execute("""
            SELECT DATE_FORMAT(reporting_month, '%Y-%m') as month_key
            FROM division_esg_data
            WHERE division_id = %s AND YEAR(reporting_month) = %s
        """, (division_id, current_year))

        rows = cur.fetchall()
        print("➡️ Raw Query Results:", rows)

        submitted = {row['month_key'] for row in rows}
        print("➡️ Submitted Months Set:", submitted)

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

    # ✅ Build months list for current year
    months = []
    for m in range(1, 13):
        month_date = datetime.date(current_year, m, 1)
        month_value = month_date.strftime("%Y-%m")
        months.append({
            "name": month_date.strftime("%B"),
            "value": month_value,
            "submitted": month_value in submitted
        })

    print("✅ Final Months Response:", months)

    return jsonify({
        "year": current_year,
        "months": months
    })
    
    # ===========================
# Circle Dashboard
# ===========================
@bp.route('/circle', methods=['GET'])
@token_required
def circle_dashboard(user):
    if user['role'] != 'circle':
        return jsonify({"error": "Unauthorized"}), 403

    circle_id = user['branch_id']
    current_year = datetime.date.today().year

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    try:
        # 1️⃣ Count divisions under this circle
        cur.execute("""
            SELECT COUNT(*) AS count 
            FROM branches 
            WHERE parent_id = %s AND level = 'division'
        """, (circle_id,))
        divisions_count = cur.fetchone()["count"]

        # 2️⃣ Count branches under those divisions
        cur.execute("""
            SELECT COUNT(*) AS count 
            FROM branches 
            WHERE parent_id IN (
                SELECT branch_id FROM branches 
                WHERE parent_id = %s AND level = 'division'
            )
        """, (circle_id,))
        branches_count = cur.fetchone()["count"]

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

    return jsonify({
        "circle_id": circle_id,
        "year": current_year,
        "divisions_count": divisions_count,
        "branches_count": branches_count
    })

