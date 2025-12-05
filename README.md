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

3.Core Features:-
    Role-based login: Branch / Division / Circle
    Monthly ESG data submission
    Auto-generated final BRSR report
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
6.REST API Flow (Client ↔ Server)

React frontend communicates with Flask using REST APIs over HTTP/HTTPS.

Typical Data Flow

Login Request (POST /auth/login)
→ Backend validates credentials
→ Generates JWT token

Frontend Stores Token
→ Redux state
→ Local/session storage

Backend Validates Token
→ Decodes JWT
→ Extracts user_id & role
→ Authorizes access

Database Query & Response
→ Backend fetches/updates MySQL
→ Sends structured JSON response

<img width="1366" height="768" alt="Screenshot (107)" src="https://github.com/user-attachments/assets/f7d6a4ca-f234-496d-ba37-05dce901281b" />
<img width="1366" height="768" alt="Screenshot (108)" src="https://github.com/user-attachments/assets/7f109fd3-1af6-4f7a-aef6-6d8247350590" />
<img width="1366" height="768" alt="Screenshot (110)" src="https://github.com/user-attachments/assets/1d5ef84f-441a-4b9a-92d1-6dbf66a5fb73" />
<img width="1366" height="768" alt="Screenshot (111)" src="https://github.com/user-attachments/assets/bda0454f-2d83-4c83-9ba2-22b761d8530a" />
<img width="1366" height="768" alt="Screenshot (113)" src="https://github.com/user-attachments/assets/785907b4-02d9-4a06-830a-caf7d038d947" />
<img width="1366" height="768" alt="Screenshot (114)" src="https://github.com/user-attachments/assets/06f384d4-253c-4c90-8fce-7a75d288599b" />
<img width="1366" height="768" alt="Screenshot (115)" src="https://github.com/user-attachments/assets/80ecc2b4-48cf-4d67-b50b-76e7f0a6cc4f" />
