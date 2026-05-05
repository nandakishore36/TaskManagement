TEAM TASK MANAGER
=================

A full-stack, role-based project management web application built with the MERN stack (MongoDB, Express.js, React, Node.js). 

This application allows teams to seamlessly create projects, assign tasks to members, and track the progress of their work in real-time through an intuitive dashboard.

--------------------------------------------------------------------------------
FEATURES
--------------------------------------------------------------------------------
- Authentication & Authorization: Secure signup and login using JWT.
- Role-Based Access Control:
  * Admins/Creators: Can create projects, add members to projects, and assign tasks.
  * Members: Can view assigned projects, view assigned tasks, and update task statuses.
- Project Management: Create new projects and invite registered users to collaborate.
- Task Tracking: Assign tasks to specific project members with Due Dates.
- Interactive Dashboard: View real-time statistics of Pending, In Progress, Completed, and Overdue tasks.
- Premium UI: Built with modern Vanilla CSS featuring glassmorphism, dynamic gradients, and micro-animations.

--------------------------------------------------------------------------------
TECHNOLOGY STACK
--------------------------------------------------------------------------------
- Frontend: React (Vite), React Router DOM, Axios, Vanilla CSS
- Backend: Node.js, Express.js, Mongoose, JWT, bcryptjs
- Database: MongoDB Atlas

--------------------------------------------------------------------------------
INSTALLATION & LOCAL SETUP
--------------------------------------------------------------------------------
1. Clone the repository
   git clone https://github.com/Jvssankar/Team-task-manager.git
   cd "Team-task-manager"

2. Backend Setup
   Navigate to the backend directory and install dependencies:
   > cd backend
   > npm install

   Create a .env file in the backend directory and add your environment variables:
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key

   Start the backend server:
   > npm run dev
   (OR: node index.js)

3. Frontend Setup
   Open a new terminal window, navigate to the frontend directory, and install dependencies:
   > cd frontend
   > npm install

   Start the Vite development server:
   > npm run dev

   The application will be running at http://localhost:5173.

--------------------------------------------------------------------------------
DEPLOYMENT (RAILWAY)
--------------------------------------------------------------------------------
This repository is structured to be easily deployed on Railway (https://railway.app/).
1. Backend: Deploy the /backend root directory as a Node.js service and add the MONGO_URI and JWT_SECRET environment variables. Generate a domain for the backend.
2. Frontend: Deploy the /frontend root directory as a static Vite service. Add the VITE_API_URL environment variable pointing to your backend's generated domain (e.g., https://your-backend-domain.up.railway.app/api).

--------------------------------------------------------------------------------
CONTRIBUTING
--------------------------------------------------------------------------------
Contributions, issues, and feature requests are welcome! Feel free to check the issues page on GitHub.
