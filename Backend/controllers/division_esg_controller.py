# controllers/division_esg_controller.py
from flask import Blueprint, request, jsonify
import mysql.connector
from functools import wraps
import jwt

# ✅ Import full config
import config
SECRET_KEY = config.SECRET_KEY

bp = Blueprint("division_esg", __name__, url_prefix="/api/division_esg")

def get_db_connection():
    return mysql.connector.connect(**config.DB_CONFIG)


# -----------------------------
# JWT authentication decorator
# -----------------------------
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            try:
                token = request.headers["Authorization"].split(" ")[1]  # Bearer <token>
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


# ===============================
# Submit Division ESG Data (Manual Entry)
# ===============================
@bp.route("/submit", methods=["POST"])
@token_required
def submit_division_esg(user):
    if user["role"] != "division":
        return jsonify({"error": "Only division officers can submit ESG data"}), 403

    division_id = user.get("branch_id")
    if not division_id:
        return jsonify({"error": "Invalid session: Division ID missing"}), 400

    data = request.get_json()
    reporting_month = data.get("reporting_month")  # e.g. "2025-08"
    if reporting_month:
        reporting_month = reporting_month + "-01"  # MySQL DATE format

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("""
            INSERT INTO division_esg_data
            (division_id, reporting_month, energy_bill, energy_kwh, fuel_litres,
             paper_reams, waste_kg, water_litres, training_hours, complaints_count)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            division_id,
            reporting_month,
            data.get("energy_bill") or 0,
            data.get("energy_kwh") or 0,
            data.get("fuel_litres") or 0,
            data.get("paper_reams") or 0,
            data.get("waste_kg") or 0,
            data.get("water_litres") or 0,
            data.get("training_hours") or 0,
            data.get("complaints_count") or 0
        ))
        conn.commit()

        return jsonify({"message": "Division ESG data submitted successfully!"}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": f"Error inserting ESG data: {str(e)}"}), 500
    finally:
        cur.close()
        conn.close()


# ===============================
# Division Dashboard Data (Aggregated)
# ===============================
@bp.route("/dashboard", methods=["GET"])
@token_required
def division_dashboard(user):
    if user["role"] != "division":
        return jsonify({"error": "Unauthorized"}), 403

    division_id = user.get("branch_id")

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    # 1️⃣ Aggregate Branch ESG under this division
    cur.execute("""
        SELECT 
            AVG(energy_kwh) AS avg_energy_kwh,
            SUM(energy_bill) AS total_energy_bill,
            SUM(fuel_litres) AS total_fuel,
            SUM(paper_reams) AS total_paper,
            SUM(waste_kg) AS total_waste,
            SUM(water_litres) AS total_water,
            SUM(training_hours) AS total_training_hours,
            SUM(complaints_count) AS total_complaints
        FROM esg_data
        WHERE branch_id IN (SELECT branch_id FROM branches WHERE parent_id = %s)
    """, (division_id,))
    branch_stats = cur.fetchone() or {}

    # 2️⃣ Aggregate Division Officer’s own ESG
    cur.execute("""
        SELECT 
            AVG(energy_kwh) AS avg_energy_kwh,
            SUM(energy_bill) AS total_energy_bill,
            SUM(fuel_litres) AS total_fuel,
            SUM(paper_reams) AS total_paper,
            SUM(waste_kg) AS total_waste,
            SUM(water_litres) AS total_water,
            SUM(training_hours) AS total_training_hours,
            SUM(complaints_count) AS total_complaints
        FROM division_esg_data
        WHERE division_id = %s
    """, (division_id,))
    division_stats = cur.fetchone() or {}

    cur.close()
    conn.close()

    # 3️⃣ Merge results (branch + division officer ESG)
    merged_stats = {
        "avg_energy_kwh": (branch_stats.get("avg_energy_kwh") or 0) + (division_stats.get("avg_energy_kwh") or 0),
        "total_energy_bill": (branch_stats.get("total_energy_bill") or 0) + (division_stats.get("total_energy_bill") or 0),
        "total_fuel": (branch_stats.get("total_fuel") or 0) + (division_stats.get("total_fuel") or 0),
        "total_paper": (branch_stats.get("total_paper") or 0) + (division_stats.get("total_paper") or 0),
        "total_waste": (branch_stats.get("total_waste") or 0) + (division_stats.get("total_waste") or 0),
        "total_water": (branch_stats.get("total_water") or 0) + (division_stats.get("total_water") or 0),
        "total_training_hours": (branch_stats.get("total_training_hours") or 0) + (division_stats.get("total_training_hours") or 0),
        "total_complaints": (branch_stats.get("total_complaints") or 0) + (division_stats.get("total_complaints") or 0),
    }

    return jsonify({
        "division_id": division_id,
        "branch_stats": branch_stats,
        "division_stats": division_stats,
        "merged_stats": merged_stats
    })



# ===============================
# Division Graph Data (Time-series for a selected ESG column)
# ===============================


@bp.route("/division_graph", methods=["GET"])
@token_required
def division_graph(user):
    if user["role"] != "division":
        return jsonify({"error": "Unauthorized"}), 403

    division_id = user.get("branch_id")
    column = request.args.get("column")

    allowed_columns = [
        "energy_bill",
        "energy_kwh",
        "fuel_litres",
        "paper_reams",
        "waste_kg",
        "water_litres",
        "training_hours",
        "complaints_count"
    ]
    if column not in allowed_columns:
        return jsonify({"error": "Invalid column name"}), 400

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    query = f"""
        SELECT reporting_month, ROUND(AVG({column})) AS avg_value
        FROM (
            SELECT d.reporting_month, d.{column}
            FROM division_esg_data d
            WHERE d.division_id = %s

            UNION ALL

            SELECT e.reporting_month, e.{column}
            FROM esg_data e
            INNER JOIN branches b ON e.branch_id = b.branch_id
            WHERE b.parent_id = %s
        ) AS combined
        GROUP BY reporting_month
        ORDER BY reporting_month
    """

    cur.execute(query, (division_id, division_id))
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify({
        "division_id": division_id,
        "column": column,
        "data": rows
    })




# ===============================
# Division average Data (Time-series for a selected ESG column)
# ===============================


@bp.route("/division_averages", methods=["GET"])
@token_required
def division_averages(user):
    if user["role"] != "division":
        return jsonify({"error": "Unauthorized"}), 403

    division_id = user.get("branch_id")

    allowed_columns = [
        "energy_bill",
        "energy_kwh",
        "fuel_litres",
        "paper_reams",
        "waste_kg",
        "water_litres",
        "training_hours",
        "complaints_count"
    ]

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    select_parts = ", ".join([f"ROUND(AVG({col})) AS avg_{col}" for col in allowed_columns])

    query = f"""
        SELECT {select_parts}
        FROM (
            SELECT d.*
            FROM division_esg_data d
            WHERE d.division_id = %s

            UNION ALL

            SELECT e.*
            FROM esg_data e
            INNER JOIN branches b ON e.branch_id = b.branch_id
            WHERE b.parent_id = %s
        ) AS combined
    """

    cur.execute(query, (division_id, division_id))
    row = cur.fetchone()

    cur.close()
    conn.close()

    return jsonify({
        "division_id": division_id,
        "averages": row
    })




# ===============================
# Division all branches yearly avgerages
# ===============================

@bp.route("/division_branch_yearly_averages", methods=["GET"])
@token_required
def division_branch_yearly_averages(user):
    if user["role"] != "division":
        return jsonify({"error": "Unauthorized"}), 403

    division_id = user.get("branch_id")

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    query = """
        SELECT 
            YEAR(e.reporting_month) AS year,
            ROUND(SUM(e.energy_bill)      / COUNT(DISTINCT e.branch_id)) AS avg_energy_bill,
            ROUND(SUM(e.energy_kwh)       / COUNT(DISTINCT e.branch_id)) AS avg_energy_kwh,
            ROUND(SUM(e.fuel_litres)      / COUNT(DISTINCT e.branch_id)) AS avg_fuel_litres,
            ROUND(SUM(e.paper_reams)      / COUNT(DISTINCT e.branch_id)) AS avg_paper_reams,
            ROUND(SUM(e.waste_kg)         / COUNT(DISTINCT e.branch_id)) AS avg_waste_kg,
            ROUND(SUM(e.water_litres)     / COUNT(DISTINCT e.branch_id)) AS avg_water_litres,
            ROUND(SUM(e.training_hours)   / COUNT(DISTINCT e.branch_id)) AS avg_training_hours,
            ROUND(SUM(e.complaints_count) / COUNT(DISTINCT e.branch_id)) AS avg_complaints_count
        FROM esg_data e
        INNER JOIN branches b 
            ON e.branch_id = b.branch_id
        WHERE b.parent_id = %s
        GROUP BY YEAR(e.reporting_month)
        ORDER BY year DESC
    """

    cur.execute(query, (division_id,))
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify({
        "division_id": division_id,
        "averages": rows
    })



# ===============================
# Only Division yearly avgerages
# ===============================
@bp.route("/division_yearly_averages", methods=["GET"])
@token_required
def division_yearly_averages(user):
    if user["role"] != "division":
        return jsonify({"error": "Unauthorized"}), 403

    division_id = user.get("branch_id")

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    query = """
        SELECT 
            YEAR(d.reporting_month) AS year,
            ROUND(SUM(d.energy_bill))       AS avg_energy_bill,
            ROUND(SUM(d.energy_kwh))        AS avg_energy_kwh,
            ROUND(SUM(d.fuel_litres))       AS avg_fuel_litres,
            ROUND(SUM(d.paper_reams))       AS avg_paper_reams,
            ROUND(SUM(d.waste_kg))          AS avg_waste_kg,
            ROUND(SUM(d.water_litres))      AS avg_water_litres,
            ROUND(SUM(d.training_hours))    AS avg_training_hours,
            ROUND(SUM(d.complaints_count))  AS avg_complaints_count
        FROM division_esg_data d
        WHERE d.division_id = %s
        GROUP BY YEAR(d.reporting_month)
        ORDER BY year DESC
    """

    cur.execute(query, (division_id,))
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify({
        "division_id": division_id,
        "averages": rows
    })


# ===============================
# BRSR report combined yearly avgerages of division and its branches
# ===============================

@bp.route("/division_BRSR_report", methods=["GET"])
@token_required
def division_combined_yearly_averages(user):
    if user["role"] != "division":
        return jsonify({"error": "Unauthorized"}), 403

    division_id = user.get("branch_id")

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    query = """
        WITH yearly_data AS (
            -- Branch averages
            SELECT 
                YEAR(e.reporting_month) AS year,
                ROUND(SUM(e.energy_bill)      / COUNT(DISTINCT e.branch_id)) AS avg_energy_bill,
                ROUND(SUM(e.energy_kwh)       / COUNT(DISTINCT e.branch_id)) AS avg_energy_kwh,
                ROUND(SUM(e.fuel_litres)      / COUNT(DISTINCT e.branch_id)) AS avg_fuel_litres,
                ROUND(SUM(e.paper_reams)      / COUNT(DISTINCT e.branch_id)) AS avg_paper_reams,
                ROUND(SUM(e.waste_kg)         / COUNT(DISTINCT e.branch_id)) AS avg_waste_kg,
                ROUND(SUM(e.water_litres)     / COUNT(DISTINCT e.branch_id)) AS avg_water_litres,
                ROUND(SUM(e.training_hours)   / COUNT(DISTINCT e.branch_id)) AS avg_training_hours,
                ROUND(SUM(e.complaints_count) / COUNT(DISTINCT e.branch_id)) AS avg_complaints_count
            FROM esg_data e
            INNER JOIN branches b 
                ON e.branch_id = b.branch_id
            WHERE b.parent_id = %s
            GROUP BY YEAR(e.reporting_month)

            UNION ALL

            -- Division totals
            SELECT 
                YEAR(d.reporting_month) AS year,
                ROUND(SUM(d.energy_bill))       AS avg_energy_bill,
                ROUND(SUM(d.energy_kwh))        AS avg_energy_kwh,
                ROUND(SUM(d.fuel_litres))       AS avg_fuel_litres,
                ROUND(SUM(d.paper_reams))       AS avg_paper_reams,
                ROUND(SUM(d.waste_kg))          AS avg_waste_kg,
                ROUND(SUM(d.water_litres))      AS avg_water_litres,
                ROUND(SUM(d.training_hours))    AS avg_training_hours,
                ROUND(SUM(d.complaints_count))  AS avg_complaints_count
            FROM division_esg_data d
            WHERE d.division_id = %s
            GROUP BY YEAR(d.reporting_month)
        )
        SELECT 
            year,
            ROUND(AVG(avg_energy_bill))      AS avg_energy_bill,
            ROUND(AVG(avg_energy_kwh))       AS avg_energy_kwh,
            ROUND(AVG(avg_fuel_litres))      AS avg_fuel_litres,
            ROUND(AVG(avg_paper_reams))      AS avg_paper_reams,
            ROUND(AVG(avg_waste_kg))         AS avg_waste_kg,
            ROUND(AVG(avg_water_litres))     AS avg_water_litres,
            ROUND(AVG(avg_training_hours))   AS avg_training_hours,
            ROUND(AVG(avg_complaints_count)) AS avg_complaints_count
        FROM yearly_data
        GROUP BY year
        ORDER BY year DESC
    """

    cur.execute(query, (division_id, division_id))
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify({
        "division_id": division_id,
        "averages": rows
    })
