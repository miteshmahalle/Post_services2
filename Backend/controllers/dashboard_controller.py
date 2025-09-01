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
    return mysql.connector.connect(**config.DB_CONFIG)


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
# ===========================
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

    # Fetch submitted reports
    cur.execute("""
        SELECT DATE_FORMAT(reporting_month, '%%Y-%%m') AS month_key
        FROM esg_data
        WHERE branch_id = %s AND YEAR(reporting_month) = %s
    """, (branch_id, current_year))
    submitted = {row['month_key'] for row in cur.fetchall()}

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

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    # Count branches under this division
    cur.execute("SELECT COUNT(*) AS count FROM branches WHERE parent_id = %s", (division_id,))
    branches_count = cur.fetchone()["count"]

    # Aggregate ESG data from all branches under this division
    cur.execute("""
        SELECT AVG(energy_kwh) AS avg_energy_kwh,
               SUM(energy_bill) AS total_energy_bill,
               SUM(fuel_litres) AS total_fuel,
               SUM(paper_reams) AS total_paper,
               SUM(waste_kg) AS total_waste,
               SUM(water_litres) AS total_water,
               SUM(training_hours) AS total_training_hours,
               SUM(complaints_count) AS total_complaints
        FROM esg_data
        WHERE branch_id IN (
            SELECT branch_id FROM branches WHERE parent_id = %s
        )
    """, (division_id,))
    division_stats = cur.fetchone() or {}

    # Generate months list
    months = []
    for m in range(1, 12 + 1):
        month_date = datetime.date(current_year, m, 1)
        months.append({
            "name": month_date.strftime("%B"),
            "value": month_date.strftime("%Y-%m"),
            "submitted": False
        })

    # Fetch submitted division ESG reports
    cur.execute("""
        SELECT DATE_FORMAT(reporting_month, '%%Y-%%m') as month_key
        FROM division_esg_data
        WHERE division_id = %s AND YEAR(reporting_month) = %s
    """, (division_id, current_year))
    submitted = {row['month_key'] for row in cur.fetchall()}

    cur.close()
    conn.close()

    # Mark submitted months
    for month in months:
        if month["value"] in submitted:
            month["submitted"] = True

    return jsonify({
        "division_id": division_id,
        "branches_count": branches_count,
        "stats": division_stats,
        "months": months,
        "year": current_year
    })
