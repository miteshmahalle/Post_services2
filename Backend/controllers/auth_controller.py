from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector
import jwt
import datetime
from functools import wraps

# ✅ Import config
import config  

SECRET_KEY = config.SECRET_KEY
bp = Blueprint('auth', __name__)

def get_db_connection():
    return mysql.connector.connect(**config.DB_CONFIG)

# ---------------- HELPER: TOKEN REQUIRED ----------------
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Get token from header
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"error": "Token is missing!"}), 401

        try:
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.current_user = decoded
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired!"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token!"}), 401

        return f(*args, **kwargs)
    return decorated


# ---------------- AUTH DECORATOR ----------------
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

# ---------------- REGISTER ----------------
# @bp.route('/register', methods=['POST'])
# def register():
#     data = request.get_json()
#     branch_code = data.get('branch_code')
#     branch_name = data.get('branch_name')
#     level = data.get('level')
#     parent_id = data.get('parent_id') or None
#     manager_name = data.get('manager_name')
#     email = data.get('email')
#     phone = data.get('phone')
#     address = data.get('address')
#     pincode = data.get('pincode')
#     state = data.get('state')
#     username = data.get('username')
#     password = data.get('password')

#     # Validate input
#     if not (branch_code and branch_name and level and username and password):
#         return jsonify({"error": "Please fill required fields"}), 400

#     conn = get_db_connection()
#     cur = conn.cursor(dictionary=True)

#     try:
#         # Check duplicates
#         cur.execute("SELECT branch_id FROM branches WHERE email = %s", (email,))
#         if cur.fetchone():
#             return jsonify({"error": "Email already exists"}), 400

#         cur.execute("SELECT branch_id FROM branches WHERE phone = %s", (phone,))
#         if cur.fetchone():
#             return jsonify({"error": "Phone already exists"}), 400

#         # Insert branch
#         cur.execute("""
#             INSERT INTO branches 
#             (branch_code, branch_name, level, parent_id, manager_name, email, phone, address, pincode, state)
#             VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
#         """, (branch_code, branch_name, level, parent_id, manager_name, email, phone, address, pincode, state))
#         branch_id = cur.lastrowid

#         # Insert user
#         password_hash = generate_password_hash(password)
#         cur.execute("""
#             INSERT INTO users (branch_id, username, password_hash, role)
#             VALUES (%s,%s,%s,%s)
#         """, (branch_id, username, password_hash, level))

#         conn.commit()
#         return jsonify({"message": "Registered successfully"}), 201

#     except mysql.connector.Error as e:
#         conn.rollback()
#         return jsonify({"error": str(e)}), 500
#     finally:
#         cur.close()
#         conn.close()


@bp.route('/register', methods=['POST'])
@token_required
def register(current_user):
    data = request.get_json()
    branch_code = data.get('branch_code')
    branch_name = data.get('branch_name')
    manager_name = data.get('manager_name')
    email = data.get('email')
    phone = data.get('phone')
    address = data.get('address')
    pincode = data.get('pincode')
    state = data.get('state')
    username = data.get('username')
    password = data.get('password')

    # ✅ Role-based authorization strictly from token
    creator_role = current_user["role"]
    parent_id = current_user["branch_id"]

    if creator_role == "branch":
        return jsonify({"error": "Branch cannot register a new user"}), 403
    elif creator_role == "division":
        new_level = "branch"
    elif creator_role == "circle":
        new_level = "division"
    else:
        return jsonify({"error": "Unauthorized role"}), 403

    # ✅ Validation
    if not (branch_code and branch_name and username and password):
        return jsonify({"error": "Please fill required fields"}), 400

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    try:
        # ✅ Duplicate checks
        if email:
            cur.execute("SELECT branch_id FROM branches WHERE email = %s", (email,))
            if cur.fetchone():
                return jsonify({"error": "Email already exists"}), 400

        if phone:
            cur.execute("SELECT branch_id FROM branches WHERE phone = %s", (phone,))
            if cur.fetchone():
                return jsonify({"error": "Phone already exists"}), 400

        # ✅ Insert branch (level + parent_id from token only)
        cur.execute("""
            INSERT INTO branches 
            (branch_code, branch_name, level, parent_id, manager_name, email, phone, address, pincode, state)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (branch_code, branch_name, new_level, parent_id, manager_name, email, phone, address, pincode, state))
        branch_id = cur.lastrowid

        # ✅ Insert user with same role as branch/division
        password_hash = generate_password_hash(password)
        cur.execute("""
            INSERT INTO users (branch_id, username, password_hash, role)
            VALUES (%s,%s,%s,%s)
        """, (branch_id, username, password_hash, new_level))

        conn.commit()
        return jsonify({
            "message": f"{new_level.capitalize()} registered successfully",
            "branch_id": branch_id
        }), 201

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
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

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


# ---------------- GET PROFILE ----------------
@bp.route('/profile', methods=['GET'])
@token_required
def get_profile():
    current_user = request.current_user
    user_id = current_user['user_id']
    
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    
    try:
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
                b.pincode,
                b.state
            FROM postal_system.users u
            LEFT JOIN postal_system.branches b 
                ON u.branch_id = b.branch_id
            WHERE u.user_id = %s
        """, (user_id,))
        user_profile = cur.fetchone()
        
        if not user_profile:
            return jsonify({"error": "User profile not found"}), 404
            
        return jsonify({
            "message": "Profile retrieved successfully",
            "profile": user_profile
        }), 200
        
    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()


# ---------------- UPDATE PROFILE ----------------
# ---------------- UPDATE PROFILE ----------------
@bp.route('/profile', methods=['PUT'])
@token_required
def update_profile():
    current_user = request.current_user
    user_id = current_user['user_id']
    branch_id = current_user['branch_id']
    
    data = request.get_json()
    
    manager_name = data.get('manager_name')
    email = data.get('email')
    phone = data.get('phone')
    address = data.get('address')
    pincode = data.get('pincode')
    state = data.get('state')
    
    # ✅ branch_name removed from required fields
    if not (manager_name and email):
        return jsonify({"error": "Manager name and email are required"}), 400
    
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    
    try:
        # Check if email already exists for another branch
        cur.execute("SELECT branch_id FROM branches WHERE email = %s AND branch_id != %s", (email, branch_id))
        if cur.fetchone():
            return jsonify({"error": "Email already exists for another branch"}), 400
        
        # Check if phone already exists for another branch
        if phone:
            cur.execute("SELECT branch_id FROM branches WHERE phone = %s AND branch_id != %s", (phone, branch_id))
            if cur.fetchone():
                return jsonify({"error": "Phone number already exists for another branch"}), 400
        
        # ✅ branch_name not included in update
        cur.execute("""
            UPDATE branches 
            SET manager_name = %s, email = %s, 
                phone = %s, address = %s, pincode = %s, state = %s
            WHERE branch_id = %s
        """, (manager_name, email, phone, address, pincode, state, branch_id))
        
        if cur.rowcount == 0:
          return jsonify({"message": "No changes were made"}), 200
        
        conn.commit()
        
        # Fetch updated profile
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
                b.pincode,
                b.state
            FROM postal_system.users u
            LEFT JOIN postal_system.branches b 
                ON u.branch_id = b.branch_id
            WHERE u.user_id = %s
        """, (user_id,))
        updated_profile = cur.fetchone()
        
        return jsonify({
            "message": "Profile updated successfully",
            "profile": updated_profile
        }), 200
        
    except mysql.connector.Error as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

