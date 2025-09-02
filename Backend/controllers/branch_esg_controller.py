from flask import Blueprint, request, jsonify
import mysql.connector
import jwt, datetime
from functools import wraps

# ✅ Import config properly
import config
SECRET_KEY = config.SECRET_KEY

bp = Blueprint("branch_esg", __name__, url_prefix="/api/branch_esg")


def get_db_connection():
    return mysql.connector.connect(**config.DB_CONFIG)


def get_user_from_db(user_id):
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("SELECT user_id, username, role, branch_id FROM users WHERE user_id = %s", (user_id,))
        user = cur.fetchone()
        return user
    except Exception as e:
        print("DB error in get_user_from_db:", e)
        return None
    finally:
        cur.close()
        conn.close()


# -----------------------------
# JWT authentication decorator
# -----------------------------
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", None)
        print("🔎 [DEBUG] Authorization header:", auth_header)

        if not auth_header:
            return jsonify({"error": "Missing Authorization header"}), 401

        try:
            parts = auth_header.split(" ")
            print("🔎 [DEBUG] Header parts:", parts)

            if len(parts) != 2 or parts[0].lower() != "bearer":
                return jsonify({"error": "Malformed Authorization header"}), 401

            token = parts[1]
            print("🔎 [DEBUG] Extracted token:", token[:30], "...")

            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            print("✅ [DEBUG] Decoded token payload:", decoded)

        except jwt.ExpiredSignatureError:
            print("❌ [DEBUG] Token expired")
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError as e:
            print("❌ [DEBUG] Invalid token:", str(e))
            return jsonify({"error": "Invalid token"}), 401
        except Exception as e:
            print("❌ [DEBUG] Other token error:", str(e))
            return jsonify({"error": f"Token error: {str(e)}"}), 401

        user_id = decoded.get("user_id")
        print("🔎 [DEBUG] Extracted user_id from token:", user_id)

        user = get_user_from_db(user_id)
        print("🔎 [DEBUG] User fetched from DB:", user)

        if not user:
            return jsonify({"error": "User not found"}), 404

        return f(user, *args, **kwargs)
    return decorated


# ===============================
# Submit ESG Data (Branch User)
# ===============================
@bp.route("/submit", methods=["POST"])
@token_required
def submit_esg(user):
    print("✅ [DEBUG] submit_esg called by user:", user)

    if user["role"] != "branch":
        print("❌ [DEBUG] Unauthorized role:", user["role"])
        return jsonify({"error": "Unauthorized"}), 403

    branch_id = user["branch_id"]
    data = request.get_json()
    print("🔎 [DEBUG] Incoming JSON data:", data)

    reporting_month = data.get("reporting_month")
    if reporting_month:
        reporting_month = reporting_month + "-01"
    print("🔎 [DEBUG] Final reporting_month:", reporting_month)

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    try:
        print("📝 [DEBUG] Inserting ESG data into DB...")
        cur.execute("""
            INSERT INTO esg_data 
            (branch_id, reporting_month, energy_bill, energy_kwh, fuel_litres,
             paper_reams, waste_kg, water_litres, training_hours, complaints_count)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            branch_id,
            reporting_month,
            data.get("energy_bill") or 0,
            data.get("energy_kwh") or 0,
            data.get("fuel_litres") or 0,
            data.get("paper_reams") or 0,
            data.get("waste_kg") or 0,
            data.get("water_litres") or 0,
            data.get("training_hours") or 0,
            data.get("complaints_count") or 0,
        ))
        conn.commit()
        print("✅ [DEBUG] Insert committed.")

        cur.execute("""
            SELECT reporting_month, energy_bill, energy_kwh, fuel_litres,
                   paper_reams, waste_kg, water_litres, training_hours, complaints_count
            FROM esg_data
            WHERE branch_id = %s AND reporting_month = %s
            ORDER BY esg_id DESC LIMIT 1
        """, (branch_id, reporting_month))
        report = cur.fetchone()
        print("✅ [DEBUG] Inserted report fetched:", report)

        return jsonify({"message": "ESG report submitted successfully", "report": report}), 201

    except Exception as e:
        conn.rollback()
        print("❌ [DEBUG] DB insert error:", str(e))
        return jsonify({"error": f"Error inserting ESG data: {str(e)}"}), 500
    finally:
        cur.close()
        conn.close()
        print("🔒 [DEBUG] DB connection closed.")


# ===============================
# Get ESG Reports for Branch
# ===============================
@bp.route("/reports", methods=["GET"])
@token_required
def get_esg_reports(user):
    if user["role"] != "branch":
        return jsonify({"error": "Unauthorized"}), 403

    branch_id = user["branch_id"]
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    cur.execute("""
        SELECT esg_id, reporting_month, energy_bill, energy_kwh, fuel_litres,
               paper_reams, waste_kg, water_litres, training_hours, complaints_count,
               created_at
        FROM esg_data
        WHERE branch_id = %s
        ORDER BY reporting_month DESC
    """, (branch_id,))
    reports = cur.fetchall()

    cur.close()
    conn.close()
    return jsonify({"branch_id": branch_id, "reports": reports})
