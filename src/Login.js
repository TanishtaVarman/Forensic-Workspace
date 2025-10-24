import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const emailUsername = username.toLowerCase().replace(/\s+/g, '');
      const email = `${emailUsername}@Order-forensic.com`;
      
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('User created successfully');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in successfully');
      }
      
      navigate('/ListOfCases');
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>

        {error && (
          <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <label>User Name</label>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[a-zA-Z0-9 ]*$/.test(value)) {
              setUsername(value);
            }
          }}
          required
          placeholder="Enter user name"
        />

        <label>ID Number</label>
        <input
          type="text"
          value={idNumber}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[0-9]*$/.test(value)) {
              setIdNumber(value);
            }
          }}
          required
          placeholder="Enter ID number"
        />

        <label>Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter password"
        />
        <label style={{ fontWeight: 400, fontSize: '14px' }}>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            style={{ marginRight: '8px' }}
          />
          Show Password
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Login')}
        </button>

        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Login here' : 'Sign up here'}
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
