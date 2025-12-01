import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// --- Import Page Components ---
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Summarizer from './pages/Summarizer';
import QuizGenerator from './pages/QuizGenerator';
import Spreeder from './pages/Spreeder'; // 👈 We keep the file import as Spreeder
import Layout from './components/Layout';

// This component checks if a user is logged in by looking for a token.
// If not, it redirects them to the login page.
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Accessible to everyone */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Private Routes - Require user to be logged in */}
        {/* These routes are wrapped in the main application Layout with the sidebar */}
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
        
        {/* ✅ UPDATED ROUTE TO /visualizer */}
        <Route
          path="/visualizer"
          element={
            <PrivateRoute>
              <Layout>
                <Spreeder />
              </Layout>
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;