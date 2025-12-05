1. Overview

The BRSR Report Generator is a web-based application designed to streamline ESG (Environmental, Social & Governance) data collection across postal levels.
Every month, Branch, Division, and Circle users report ESG metrics, which are consolidated into a final BRSR report.

2. Tech Stack:-
   
    Frontend:- React.js
               Redux Toolkit
               Axios (API calls)
               React Router
               Client-side session/local storage

    Backend:-Flask (Python)
             Flask-JWT-Extended
             MySQL Connector 
             REST APIs using Flask Blueprint architecture
   
    Authentication:-
             JWT for authentication
             CORS middleware
             Role-based access control (RBAC)

3.Core Features:-<img width="1366" height="768" alt="Screenshot (108)" src="https://github.com/user-attachments/assets/60c37d61-b74a-4e15-a04b-2d39eddb61d8" />

                 Role-based login: Branch / Division / Circle
                 Monthly ESG data submission
                 Auto-generated fi<img width="1366" height="768" alt="Screenshot (107)" src="https://github.com/user-attachments/assets/e0f9f23c-6943-49fa-b1ac-7fae8a5d7f4b" />
nal BRSR report
                 Analytical dashboards with charts & summaries
                 Secure login, token validation & protected routes
                 API-driven modular architecture
                 Optimized form handling & data validation

4.User Roles & Workflow:-
                          1. Branch User:- 
                                        Submits monthly ESG forms
                                        Views Branch-level analytic
                                           
                          2. Division User:-
                                        Approves & monitors Branch submissions
                                        Submits Division-level ESG data

                          3. Circle User:-
                                        Monitors all Divisions
                                        Generates and reviews final consolidated BRSR report
6. 🔗 REST API Flow (Client ↔ Server)

React frontend communicates with Flask using REST APIs over HTTP/HTTPS.

Typical Data Flow

Login Request (POST /auth/login)
→ Backend validates credentials
→ Generates JWT token

Frontend Stores Token
→ Redux state
→ Local/session storage

Authenticated API Requests
Example:

GET /api/esg/branch/monthly  
Headers: Authorization: Bearer <JWT_TOKEN>


Backend Validates Token
→ Decodes JWT
→ Extracts user_id & role
→ Authorizes access

Database Query & Response
→ Backend fetches/updates MySQL
→ Sends structured JSON response
