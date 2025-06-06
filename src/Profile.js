import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { 
  onAuthStateChanged, 
  updateProfile, 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';
import './Profile.css';

const Profile = ({ onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    password: '••••••••',
    idNumber: '',
    designation: 'Investigator'
  });

  const [editData, setEditData] = useState({ ...profileData });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadUserData(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (currentUser) => {
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfileData({
          name: userData.name || currentUser.displayName || 'User',
          email: currentUser.email || '',
          password: '••••••••',
          idNumber: userData.idNumber || '',
          designation: userData.designation || 'Investigator'
        });
      } else {
        const initialData = {
          name: currentUser.displayName || 'User',
          email: currentUser.email,
          idNumber: generateNumericId(),
          designation: 'Investigator',
          createdAt: new Date().toISOString()
        };
        
        await setDoc(userDocRef, initialData);
        setProfileData({
          ...initialData,
          password: '••••••••'
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      alert('Error loading profile data: ' + error.message);
    }
  };

  const generateNumericId = () => {
    return Math.floor(Math.random() * 9000000000) + 1000000000; 
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData, password: '' });
  };

  const handleSave = async () => {
    try {
      if (editData.password && editData.password !== '') {
        setShowReauthModal(true);
        return;
      }
      
      await saveProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile: ' + error.message);
    }
  };

  const saveProfile = async () => {
    try {
      if (editData.name !== profileData.name && user) {
        await updateProfile(user, {
          displayName: editData.name
        });
      }

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        name: editData.name,
        idNumber: editData.idNumber,
        designation: editData.designation,
        updatedAt: new Date().toISOString()
      });

      const updatedData = { ...editData };
      updatedData.password = '••••••••';
      
      setProfileData(updatedData);
      setIsEditing(false);
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile: ' + error.message);
    }
  };

  const handleReauthAndUpdatePassword = async () => {
    try {
      if (!currentPassword) {
        alert('Please enter your current password');
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      if (editData.password && editData.password !== '') {
        await updatePassword(user, editData.password);
      }

      setShowReauthModal(false);
      setCurrentPassword('');
      await saveProfile();

    } catch (error) {
      console.error('Error updating password:', error);
      if (error.code === 'auth/wrong-password') {
        alert('Current password is incorrect');
      } else {
        alert('Error updating password: ' + error.message);
      }
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
    setShowReauthModal(false);
    setCurrentPassword('');
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error">Please log in to view your profile.</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <h1 className="profile-title">User Profile</h1>
        <div className="profile-actions">
          {!isEditing ? (
            <button className="edit-button" onClick={handleEdit}>
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button className="save-button" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-large">
            <div className="avatar-icon"></div>
          </div>

          <div className="profile-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-input"
                  value={editData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="form-value">{profileData.name}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="form-value">{profileData.email}</div>
              <small className="form-help">Email cannot be changed here</small>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              {isEditing ? (
                <input
                  type="password"
                  className="form-input"
                  value={editData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter new password (leave blank to keep current)"
                />
              ) : (
                <div className="form-value">{profileData.password}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">ID Number (Numbers Only)</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-input"
                  value={editData.idNumber}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, '');
                    handleInputChange('idNumber', numericValue);
                  }}
                  placeholder="Enter your numeric ID"
                  maxLength="10"
                />
              ) : (
                <div className="form-value">{profileData.idNumber}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Designation</label>
              {isEditing ? (
                <select
                  className="form-input form-select"
                  value={editData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                >
                  <option value="Lead Investigator">Lead Investigator</option>
                  <option value="Senior Investigator">Senior Investigator</option>
                  <option value="Investigator">Investigator</option>
                  <option value="Junior Investigator">Junior Investigator</option>
                  <option value="Forensic Analyst">Forensic Analyst</option>
                  <option value="Team Lead">Team Lead</option>
                  <option value="Department Head">Department Head</option>
                  <option value="Administrator">Administrator</option>
                </select>
              ) : (
                <div className="form-value">{profileData.designation}</div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-info">
          <h3>Account Information</h3>
          <p>These credentials are used for system authentication and access control. Please keep your information up to date and secure.</p>
          <small>User ID: {user.uid}</small>
        </div>
      </div>

      {showReauthModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Password Change</h3>
            </div>
            <div className="modal-body">
              <p>To change your password, please enter your current password:</p>
              <input
                type="password"
                className="form-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button className="confirm-button" onClick={handleReauthAndUpdatePassword}>
                Confirm & Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;