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
import PdfTools from './pages/PdfTools';       
import PdfToolView from './pages/PdfToolView'; 
import StudyPlanner from './pages/StudyPlanner'; // ✅ NEW IMPORT

// --- Layout ---
import Layout from './components/Layout';

// --- Private Route Logic ---
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* -------------------- PUBLIC ROUTES -------------------- */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* -------------------- PRIVATE ROUTES -------------------- */}
        
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Navigate to="/home" replace />
            </PrivateRoute>
          } 
        />

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

        {/* ✅ NEW: Study Planner Route */}
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
          path="/pdf-viewer"
          element={
            <PrivateRoute>
              <Layout>
                <PdfViewer />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* --- PDF TOOLS ROUTES --- */}
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

      </Routes>
    </Router>
  );
}

export default App;