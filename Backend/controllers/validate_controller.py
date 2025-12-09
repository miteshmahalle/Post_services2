from flask import Blueprint, request, jsonify
import mysql.connector

# ✅ Import full config
import config
SECRET_KEY = config.SECRET_KEY

bp = Blueprint('validate', __name__)

def get_db_connection():
    return mysql.connector.connect(
    host=config.DB_CONFIG['host'],
    user=config.DB_CONFIG['user'],
    password=config.DB_CONFIG['password'],
    database=config.DB_CONFIG['database'],
    port=config.DB_CONFIG['port']
    )


@bp.route('/registration', methods=['POST'])
def validate_registration():
    """
    Validate registration inputs before final submission.
    """
    data = request.get_json(force=True)  # always expect JSON

    branch_code = (data.get('branch_code') or '').strip()
    branch_name = (data.get('branch_name') or '').strip()
    level = (data.get('level') or '').strip().lower()
    parent_id = data.get('parent_id')
    email = (data.get('email') or '').strip()
    phone = (data.get('phone') or '').strip()
    pincode = (data.get('pincode') or '').strip()
    username = (data.get('username') or '').strip()

    errors = {}

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    try:
        # Username check
        if username:
            cur.execute("SELECT user_id FROM users WHERE username = %s", (username,))
            if cur.fetchone():
                errors['username'] = "Username already exists."

        # Email check
        if email:
            cur.execute("SELECT branch_id FROM branches WHERE email = %s", (email,))
            if cur.fetchone():
                errors['email'] = "Email already exists."

        # Phone check
        if phone:
            cur.execute("SELECT branch_id FROM branches WHERE phone = %s", (phone,))
            if cur.fetchone():
                errors['phone'] = "Phone number already exists."

        # Division rules
        if level == 'division' and pincode:
            cur.execute("SELECT branch_id FROM branches WHERE level = 'division' AND pincode = %s", (pincode,))
            if cur.fetchone():
                errors['pincode'] = "This pincode is already used by another division."

        # Branch rules
        elif level == 'branch':
            if not parent_id:
                errors['parent_id'] = "Branch must have a parent division."
            else:
                cur.execute("SELECT pincode FROM branches WHERE branch_id = %s AND level = 'division'", (parent_id,))
                parent_div = cur.fetchone()
                if not parent_div:
                    errors['parent_id'] = "Selected parent is not a valid division."
                elif pincode and (pincode != parent_div['pincode']):
                    errors['pincode'] = f"Branch pincode must match parent division pincode ({parent_div['pincode']})."

    except mysql.connector.Error as e:
        cur.close()
        conn.close()
        return jsonify({
            "ok": False,
            "errors": {"__server": f"Database error: {e}"}
        }), 500

    cur.close()
    conn.close()

    return jsonify({
        "ok": len(errors) == 0,
        "errors": errors
    }), (200 if not errors else 400)
