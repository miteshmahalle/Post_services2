# Backend/config.py
DB_CONFIG = {
    'host': 'localhost',
    'user': 'flaskuser',
    'password': '1234',        # <-- same password you used
    'database': 'Postal_system'
}

# Secret key for sessions (for Flask-JWT or session management)
SECRET_KEY = 'my_super_secret_key_12345'
