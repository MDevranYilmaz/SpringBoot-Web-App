import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { isAuthenticated, getUserInfo } from './services/api'
import Login from './login/login'
import HRDashboard from './hrpage/hrDashboard'
import AdminDashboard from './adminpage/adminDashboard'
import './App.css'

function ProtectedRoute({ children, requiredRole = null }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (requiredRole) {
    const userInfo = getUserInfo();
    if (userInfo?.role !== requiredRole) {

      if (userInfo?.role === 'ADMIN') {
        return <Navigate to="/admin" />;
      } else {
        return <Navigate to="/hr-dashboard" />;
      }
    }
  }

  return children;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/hr-dashboard"
            element={
              <ProtectedRoute requiredRole="HR">
                <HRDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated() ?
                (() => {
                  const userInfo = getUserInfo();
                  if (userInfo?.role === 'ADMIN') {
                    return <Navigate to="/admin" />;
                  } else {
                    return <Navigate to="/hr-dashboard" />;
                  }
                })() :
                <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
