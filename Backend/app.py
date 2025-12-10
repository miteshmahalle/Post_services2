from flask import Flask, jsonify
from flask_cors import CORS
from config import SECRET_KEY
import os

# Import blueprints from controllers
from controllers import (
    auth_controller,
    dashboard_controller,
    division_esg_controller,
    branch_esg_controller,
    #brsr_controller,
    validate_controller,
    fetch_data_controller
)

app = Flask(__name__)
app.secret_key = SECRET_KEY

# Enable CORS so React can call Flask APIs
CORS(app,
     resources={r"/*": {"origins": "https://post-services2.vercel.app"}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
# Register Blueprints
app.register_blueprint(auth_controller.bp, url_prefix="/api/auth")
app.register_blueprint(dashboard_controller.bp, url_prefix="/api/dashboard")
app.register_blueprint(division_esg_controller.bp, url_prefix="/api/division_esg")
app.register_blueprint(branch_esg_controller.bp, url_prefix="/api/branch_esg")
#app.register_blueprint(brsr_controller.bp, url_prefix="/api/brsr")
app.register_blueprint(validate_controller.bp, url_prefix="/api/validate")
app.register_blueprint(fetch_data_controller.bp, url_prefix="/api/fetch_data")
# Ensure reports folder exists
if not os.path.exists('reports'):
    os.makedirs('reports')
    
@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "message": "API running"})

if __name__ == '__main__':
    app.run()