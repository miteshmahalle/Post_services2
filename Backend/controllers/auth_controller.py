from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector
import jwt
import datetime

# ✅ Import your config properly
import config  

SECRET_KEY = config.SECRET_KEY   # pull from config.py

print("🔎 Loaded config from:", config.__file__)
print("🔎 DB_CONFIG:", getattr(config, "DB_CONFIG", None))

bp = Blueprint('auth', __name__)

def get_db_connection():
    return mysql.connector.connect(**config.DB_CONFIG)


# ---------------- REGISTER ----------------
@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    branch_code = data.get('branch_code')
    branch_name = data.get('branch_name')
    level = data.get('level')
    parent_id = data.get('parent_id') or None
    manager_name = data.get('manager_name')
    email = data.get('email')
    phone = data.get('phone')
    address = data.get('address')
    pincode = data.get('pincode')
    state = data.get('state')
    username = data.get('username')
    password = data.get('password')

    # Validate input
    if not (branch_code and branch_name and level and username and password):
        return jsonify({"error": "Please fill required fields"}), 400

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    try:
        # Check duplicates
        cur.execute("SELECT branch_id FROM branches WHERE email = %s", (email,))
        if cur.fetchone():
            return jsonify({"error": "Email already exists"}), 400

        cur.execute("SELECT branch_id FROM branches WHERE phone = %s", (phone,))
        if cur.fetchone():
            return jsonify({"error": "Phone already exists"}), 400

        # Insert branch
        cur.execute("""
            INSERT INTO branches 
            (branch_code, branch_name, level, parent_id, manager_name, email, phone, address, pincode, state)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (branch_code, branch_name, level, parent_id, manager_name, email, phone, address, pincode, state))
        branch_id = cur.lastrowid

        # Insert user
        password_hash = generate_password_hash(password)
        cur.execute("""
            INSERT INTO users (branch_id, username, password_hash, role)
            VALUES (%s,%s,%s,%s)
        """, (branch_id, username, password_hash, level))

        conn.commit()
        return jsonify({"message": "Registered successfully"}), 201

    except mysql.connector.Error as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()


# ---------------- LOGIN ----------------
@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    # ✅ Query with JOIN to fetch branch details
    cur.execute("""
        SELECT 
            u.user_id,
            u.role,
            u.branch_id,
            u.username,
            b.branch_name,
            b.branch_code,
            b.manager_name,
            b.email,
            b.phone,
            b.parent_id,
            b.address,
            u.password_hash
        FROM postal_system.users u
        LEFT JOIN postal_system.branches b 
            ON u.branch_id = b.branch_id
        WHERE u.username = %s
    """, (username,))
    user = cur.fetchone()

    cur.close()
    conn.close()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if check_password_hash(user['password_hash'], password):
        payload = {
            'user_id': user['user_id'],
            'username': user['username'],
            'role': user['role'],
            'branch_id': user['branch_id'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        token = jwt.encode(payload, config.SECRET_KEY, algorithm='HS256')

        # ✅ Return token + extra details
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "user_id": user['user_id'],
                "username": user['username'],
                "role": user['role'],
                "branch_id": user['branch_id'],
                "branch_name": user['branch_name'],
                "branch_code": user['branch_code'],
                "manager_name": user['manager_name'],
                "email": user['email'],
                "phone": user['phone'],
                "parent_id": user['parent_id'],
                "address": user['address']
            }
        }), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# ---------------- LOGOUT ----------------
@bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Logged out successfully"}), 200