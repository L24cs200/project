import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// --- Pages ---
import Homepage from './pages/Homepage';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Summarizer from './pages/Summarizer';
import QuizGenerator from './pages/QuizGenerator';
import Visualizer from './pages/Visualizer';
import PdfViewer from './pages/PdfViewer';

// --- Layout ---
import Layout from './components/Layout';

// --- Private Route Logic ---
// Checks for token. If missing, redirects to Login.
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* -------------------- PUBLIC ROUTES -------------------- */}
        {/* These pages appear without the Sidebar Layout */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* -------------------- PRIVATE ROUTES -------------------- */}
        
        {/* 1. Root Path Redirect Logic:
            - If User is NOT logged in: PrivateRoute sends them to /login
            - If User IS logged in: Navigate sends them to /home
        */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Navigate to="/home" replace />
            </PrivateRoute>
          } 
        />

        {/* 2. The Actual Homepage Route */}
        <Route 
          path="/home"
          element={
            <PrivateRoute>
              <Layout>
                <Homepage />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* 3. Other App Pages (Wrapped in Layout) */}
        <Route 
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route 
          path="/summarizer"
          element={
            <PrivateRoute>
              <Layout>
                <Summarizer />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route 
          path="/quiz-generator"
          element={
            <PrivateRoute>
              <Layout>
                <QuizGenerator />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route 
          path="/visualizer"
          element={
            <PrivateRoute>
              <Layout>
                <Visualizer />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route 
          path="/pdf-viewer"
          element={
            <PrivateRoute>
              <Layout>
                <PdfViewer />
              </Layout>
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;