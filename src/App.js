import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import './App.css';
import Login from './Login';
import NewCasePage from './NewCasePage';
import ListOfCases from './ListOfCases';
import CaseDetails from './casedetails';
function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/" replace />;
}

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e3a8a' }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1e3a8a',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '30px 60px'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '12px 24px',
          borderRadius: '25px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'white',
          letterSpacing: '1px'
        }}>
          Order ❄️
        </div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 60px',
        gap: '100px',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{ flex: 1, maxWidth: '650px', textAlign: 'left', paddingLeft: '40px' }}>
          <h1 style={{
            color: 'white',
            fontSize: '64px',
            fontWeight: 'bold',
            marginBottom: '40px',
            lineHeight: '1.1',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            Welcome
          </h1>
          
          <h2 style={{
            color: 'white',
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '40px',
            lineHeight: '1.1',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            marginTop: '-20px'
          }}>
            to Order
          </h2>
          
          <p style={{
            color: 'white',
            fontSize: '18px',
            lineHeight: '1.7',
            marginBottom: '50px',
            opacity: '0.95',
            maxWidth: '580px',
            textAlign: 'left'
          }}>
            Order is a secure, all-in-one platform designed for forensic professionals to manage digital evidence with ease. From case creation to secure evidence storage and chain of custody tracking, we handle the technical complexity so you can focus on solving cases and delivering justice.
          </p>

          <div style={{ display: 'flex', gap: '25px', marginBottom: '80px' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: '#ea580c',
                color: 'white',
                border: 'none',
                padding: '18px 35px',
                fontSize: '20px',
                fontWeight: 'bold',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(234, 88, 12, 0.3)'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ea580c'}>
                Login
              </button>
            </Link>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: '#ea580c',
                color: 'white',
                border: 'none',
                padding: '18px 35px',
                fontSize: '20px',
                fontWeight: 'bold',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(234, 88, 12, 0.3)'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ea580c'}>
                Create an account
              </button>
            </Link>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="450" height="450" viewBox="0 0 450 450" style={{ maxWidth: '100%' }}>
            <defs>
              <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 0.8}} />
                <stop offset="100%" style={{stopColor: '#1d4ed8', stopOpacity: 0.9}} />
              </linearGradient>
              <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#f8fafc', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#e2e8f0', stopOpacity: 1}} />
              </linearGradient>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.25"/>
              </filter>
            </defs>
            
            <rect x="100" y="80" width="250" height="180" fill="url(#cardGradient)" rx="20" filter="url(#shadow)"/>
            <rect x="115" y="95" width="220" height="150" fill="url(#screenGradient)" rx="8"/>
            
            <rect x="130" y="110" width="60" height="8" fill="#3b82f6" rx="4"/>
            <rect x="200" y="110" width="40" height="8" fill="#10b981" rx="4"/>
            <rect x="250" y="110" width="70" height="8" fill="#f59e0b" rx="4"/>
            
            <rect x="130" y="130" width="8" height="40" fill="#3b82f6" rx="2"/>
            <rect x="145" y="140" width="8" height="30" fill="#10b981" rx="2"/>
            <rect x="160" y="125" width="8" height="45" fill="#f59e0b" rx="2"/>
            <rect x="175" y="135" width="8" height="35" fill="#ef4444" rx="2"/>
            <rect x="190" y="120" width="8" height="50" fill="#8b5cf6" rx="2"/>
            
            <rect x="220" y="130" width="90" height="25" fill="white" rx="6" stroke="#e2e8f0"/>
            <rect x="225" y="135" width="20" height="4" fill="#6b7280" rx="2"/>
            <rect x="225" y="142" width="35" height="4" fill="#3b82f6" rx="2"/>
            <rect x="225" y="149" width="25" height="4" fill="#6b7280" rx="2"/>
            
            <rect x="220" y="165" width="90" height="25" fill="white" rx="6" stroke="#e2e8f0"/>
            <rect x="225" y="170" width="15" height="4" fill="#6b7280" rx="2"/>
            <rect x="225" y="177" width="40" height="4" fill="#10b981" rx="2"/>
            <rect x="225" y="184" width="30" height="4" fill="#6b7280" rx="2"/>
            
            <circle cx="200" cy="320" r="45" fill="#1f2937" opacity="0.1"/>
            <circle cx="200" cy="320" r="35" fill="#374151" opacity="0.8"/>
            <path d="M190 310 L190 300 Q190 295 195 295 L205 295 Q210 295 210 300 L210 310 M185 310 L215 310 Q220 310 220 315 L220 325 Q220 330 215 330 L185 330 Q180 330 180 325 L180 315 Q180 310 185 310" fill="#fbbf24"/>
            <circle cx="200" cy="322" r="3" fill="#92400e"/>
            
            <line x1="200" y1="280" x2="200" y2="260" stroke="#60a5fa" strokeWidth="3" strokeDasharray="5,5"/>
            <line x1="200" y1="260" x2="225" y2="200" stroke="#60a5fa" strokeWidth="3"/>
            <line x1="200" y1="260" x2="175" y2="200" stroke="#60a5fa" strokeWidth="3"/>
            
            <circle cx="200" cy="260" r="6" fill="#3b82f6"/>
            <circle cx="225" cy="200" r="5" fill="#10b981"/>
            <circle cx="175" cy="200" r="5" fill="#f59e0b"/>
            
            <rect x="340" y="290" width="25" height="35" fill="white" rx="3" stroke="#d1d5db" strokeWidth="1"/>
            <line x1="344" y1="298" x2="358" y2="298" stroke="#9ca3af" strokeWidth="1"/>
            <line x1="344" y1="304" x2="358" y2="304" stroke="#9ca3af" strokeWidth="1"/>
            <line x1="344" y1="310" x2="355" y2="310" stroke="#9ca3af" strokeWidth="1"/>
            <line x1="344" y1="316" x2="352" y2="316" stroke="#9ca3af" strokeWidth="1"/>
            
            <circle cx="120" cy="200" r="8" fill="#ec4899" opacity="0.7"/>
            <rect x="115" y="195" width="10" height="10" fill="white" rx="1"/>
            <text x="120" y="202" textAnchor="middle" fontSize="8" fill="#1f2937">📊</text>
            
            <circle cx="350" cy="180" r="8" fill="#06b6d4" opacity="0.7"/>
            <rect x="345" y="175" width="10" height="10" fill="white" rx="1"/>
            <text x="350" y="182" textAnchor="middle" fontSize="8" fill="#1f2937">🔒</text>
          </svg>
        </div>
      </div>

      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '40px 60px',
        marginTop: '40px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          textAlign: 'left'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: 'white'
          }}>
            Contact Us
          </h3>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            opacity: '0.9',
            color: 'white',
            maxWidth: '600px'
          }}>
            Have any questions or need assistance? Our team is here to support you every step of the way.<br />
            Reach us at <a href="https://www.Order-platform.com" style={{ color: '#60a5fa', textDecoration: 'underline' }}>www.Order-platform.com</a> or <span style={{ color: '#60a5fa' }}>[+91-98765-43210]</span>.
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} />
      
      <Route 
        path="/listofcases" 
        element={
          <ProtectedRoute>
            <ListOfCases />
          </ProtectedRoute>
        } 
      />
      <Route path="/create-case" element={<NewCasePage />} />
      <Route path="/case/:caseId" element={<CaseDetails />} />

      
    </Routes>
  );
}

export default App;
