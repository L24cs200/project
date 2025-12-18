import React, { useState, useEffect } from 'react';
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
import PdfTools from './pages/PdfTools';       
import PdfToolView from './pages/PdfToolView'; 
import StudyPlanner from './pages/StudyPlanner'; 
import FocusPage from './pages/FocusPage';

// --- Components ---
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen'; // ✅ Your new Splash Screen

// --- Private Route Logic ---
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  // --- 1. State for Splash Screen ---
  const [showSplash, setShowSplash] = useState(true);

  // --- 2. Timer Logic (2.5 Seconds) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // --- 3. Render Splash Screen First ---
  if (showSplash) {
    return <SplashScreen />;
  }

  // --- 4. Render Main Application ---
  return (
    <Router>
      <Routes>

        {/* -------------------- PUBLIC ROUTES -------------------- */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* -------------------- PRIVATE ROUTES -------------------- */}
        
        {/* Root Redirects to Home */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Navigate to="/home" replace />
            </PrivateRoute>
          } 
        />

        {/* Home Feed */}
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

        {/* Dashboard */}
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

        {/* Study Planner (and alias /planner) */}
        <Route 
          path="/study-planner"
          element={
            <PrivateRoute>
              <Layout>
                <StudyPlanner />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route 
          path="/planner" 
          element={
            <PrivateRoute>
              <Layout>
                <StudyPlanner />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* PDF Tools & Viewer */}
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
        <Route 
          path="/pdf-tools"
          element={
            <PrivateRoute>
              <Layout>
                <PdfTools />
              </Layout>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/pdf-tools/:toolId" 
          element={
            <PrivateRoute>
              <Layout>
                <PdfToolView />
              </Layout>
            </PrivateRoute>
          } 
        />

        {/* AI Tools */}
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

        {/* Focus Mode (No Layout) */}
        <Route 
          path="/focus"
          element={
            <PrivateRoute>
               <FocusPage />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;