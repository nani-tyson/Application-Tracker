# Application Tracker

A full-stack Recruiter Dashboard to manage candidate applications efficiently. Built with React (Vite) for the frontend and Node.js/Express + MongoDB for the backend.

## ✨ Features

- **Kanban Dashboard**: Drag-and-drop candidate applications across stages: Applied, Interview, Offer, Rejected.
- **Analytics Dashboard**: Visual charts for application stages, candidate roles, and average experience.
- **Add/Edit/Delete Candidates**: Seamless form to manage candidate information.
- **Filters & Search**: Quickly filter candidates by role, status, experience, or search by name/role.
- **Resume Access**: Direct links to candidate resumes.
- **Responsive Design**: Works on both desktop and mobile screens.

## 🛠 Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, @hello-pangea/dnd (drag-and-drop)
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Charts**: Chart.js (Pie & Bar charts)
- **Icons**: React Icons (Feather)

## 🌐 Live Demo

🔗 [Deployed Application](https://application-tracker-vxrf.vercel.app/)

## 🚀 Getting Started (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/nani-tyson/Application-Tracker.git
cd Application-Tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder with the following content:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The application should now be running on `http://localhost:5173` (frontend) and `http://localhost:5000` (backend).
