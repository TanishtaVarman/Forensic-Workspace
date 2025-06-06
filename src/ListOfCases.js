import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Profile from './Profile'; 
const ListOfCases = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false); 
  const [cases] = useState([
    {
      id: 'CASE-001',
      title: 'Digital Fraud Investigation',
      status: 'Ongoing',
      priority: 'High',
      dateCreated: '2024-12-01',
      assignedTo: 'Agent Smith',
      description: 'Investigation of suspected digital fraud involving cryptocurrency transactions'
    },
    {
      id: 'CASE-002',
      title: 'Data Breach Analysis',
      status: 'Open',
      priority: 'Medium',
      dateCreated: '2024-11-28',
      assignedTo: 'Agent Johnson',
      description: 'Analysis of corporate data breach incident'
    },
    {
      id: 'CASE-003',
      title: 'Downtown Homicide Investigation',
      status: 'Ongoing',
      priority: 'High',
      dateCreated: '2024-12-05',
      assignedTo: 'Detective Martinez',
      description: 'Fatal shooting incident at downtown business district - multiple witnesses'
    },
    {
      id: 'CASE-004',
      title: 'Domestic Violence Homicide',
      status: 'Open',
      priority: 'High',
      dateCreated: '2024-11-22',
      assignedTo: 'Detective Thompson',
      description: 'Victim found deceased at residence - suspected domestic violence escalation'
    },
    {
      id: 'CASE-005',
      title: 'Park Murder Investigation',
      status: 'Reviewing',
      priority: 'High',
      dateCreated: '2024-11-18',
      assignedTo: 'Detective Rodriguez',
      description: 'Body discovered in city park - forensic evidence under review'
    },
    {
      id: 'CASE-006',
      title: 'Suspicious Package Investigation',
      status: 'Closed',
      priority: 'High',
      dateCreated: '2024-11-20',
      assignedTo: 'Agent Turner',
      description: 'Bomb threat at federal building - package rendered safe, suspect in custody'
    },
    {
      id: 'CASE-007',
      title: 'Online Terrorist Recruitment',
      status: 'Ongoing',
      priority: 'High',
      dateCreated: '2024-11-25',
      assignedTo: 'Agent Chen',
      description: 'Monitoring suspected terrorist recruitment activities on social media platforms'
    },
    {
      id: 'CASE-008',
      title: 'Child Abduction Investigation',
      status: 'Dead',
      priority: 'High',
      dateCreated: '2024-12-04',
      assignedTo: 'Agent Collins',
      description: 'Missing 8-year-old child case - investigation stalled due to lack of evidence'
    }
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      navigate('/');
    }
  };

  const handleCaseClick = (caseId) => {
    navigate(`/case/${caseId}`);
  };

  const getStatusCounts = () => {
    const counts = {
      Closed: cases.filter(c => c.status === 'Closed').length,
      Open: cases.filter(c => c.status === 'Open').length,
      Ongoing: cases.filter(c => c.status === 'Ongoing').length,
      Dead: cases.filter(c => c.status === 'Dead').length,
      Reviewing: cases.filter(c => c.status === 'Reviewing').length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'All' || caseItem.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Closed':
        return '#10b981'; 
      case 'Open':
        return '#eab308'; 
      case 'Ongoing':
        return '#ef4444'; 
      case 'Dead':
        return '#8b4513'; 
      case 'Reviewing':
        return '#f97316';  
      default:
        return '#6b7280';
    }
  };

  const getStatusBoxData = () => [
    { 
      label: 'Closed Cases', 
      count: statusCounts.Closed, 
      color: '#10b981', 
      status: 'Closed',
      
    },
    { 
      label: 'Open Cases', 
      count: statusCounts.Open, 
      color: '#eab308', 
      status: 'Open',
      
    },
    { 
      label: 'Ongoing Cases', 
      count: statusCounts.Ongoing, 
      color: '#ef4444', 
      status: 'Ongoing',
      
    },
    { 
      label: 'Dead Cases', 
      count: statusCounts.Dead, 
      color: '#8b4513', 
      status: 'Dead',
    },
    { 
      label: 'Reviewing Cases', 
      count: statusCounts.Reviewing, 
      color: '#f97316', 
      status: 'Reviewing',
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#ef4444';
      case 'Medium':
        return '#f59e0b';
      case 'Low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
      }}>
        <div style={{
          color: 'white',
          fontSize: '18px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          Loading...
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  if (showProfile) {
    return <Profile onBack={() => setShowProfile(false)} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'white',
            letterSpacing: '1px'
          }}>
            EKSPERTIZA ❄️
          </div>
          {user && (
            <div style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px'
            }}>
              Welcome, {user.email}
            </div>
          )}
        </div>
        {/* ADD PROFILE BUTTON HERE */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowProfile(true)}
            style={{
              backgroundColor: '#6366f1',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#5856eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#6366f1'}
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#ef4444',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        padding: '40px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: '32px',
          fontWeight: 'bold',
          margin: '0 0 30px 0',
          textAlign: 'center'
        }}>
          Case Management Dashboard
        </h1>

        {/* Status Statistics Boxes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {getStatusBoxData().map((statusBox, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '25px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
              }}
              onClick={() => setSelectedFilter(statusBox.status)}
            >
              <div style={{
                fontSize: '40px',
                marginBottom: '15px'
              }}>
                {statusBox.icon}
              </div>
              <h3 style={{
                margin: '0 0 10px 0',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#1f2937'
              }}>
                {statusBox.label}
              </h3>
              <div style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: statusBox.color,
                marginBottom: '15px'
              }}>
                {statusBox.count}
              </div>
              <button
                style={{
                  backgroundColor: statusBox.color,
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  width: '100%'
                }}
                onMouseOver={(e) => e.target.style.opacity = '0.8'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
              >
                View {statusBox.label}
              </button>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setSelectedFilter('All')}
              style={{
                backgroundColor: selectedFilter === 'All' ? '#3b82f6' : 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              All Cases ({cases.length})
            </button>
            {getStatusBoxData().map((status, index) => (
              <button
                key={index}
                onClick={() => setSelectedFilter(status.status)}
                style={{
                  backgroundColor: selectedFilter === status.status ? status.color : 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                {status.status} ({status.count})
              </button>
            ))}
          </div>
          
          <div style={{
            display: 'flex',
            gap: '15px',
            alignItems: 'center'
          }}>
            <input
              type="text"
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 15px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '14px',
                width: '200px',
                backdropFilter: 'blur(10px)'
              }}
            />
            <button
              onClick={() => navigate('/create-case')}
              style={{
                backgroundColor: '#10b981',
                border: 'none',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              + New Case
            </button>
          </div>
        </div>

        {/* Current Filter Display */}
        {selectedFilter !== 'All' && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '10px 20px',
            borderRadius: '8px',
            marginBottom: '20px',
            color: 'white',
            fontSize: '14px'
          }}>
            Showing {selectedFilter} cases ({filteredCases.length} results)
            <button
              onClick={() => setSelectedFilter('All')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#60a5fa',
                marginLeft: '10px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Cases Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '20px'
        }}>
          {filteredCases.map((case_) => (
            <div
              key={case_.id}
              onClick={() => handleCaseClick(case_.id)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderLeft: `4px solid ${getStatusColor(case_.status)}`
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '15px'
              }}>
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '5px'
                  }}>
                    {case_.title}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    {case_.id}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexDirection: 'column'
                }}>
                  <span style={{
                    backgroundColor: getStatusColor(case_.status),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>
                    {case_.status}
                  </span>
                  <span style={{
                    backgroundColor: getPriorityColor(case_.priority),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>
                    {case_.priority}
                  </span>
                </div>
              </div>

              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#4b5563',
                lineHeight: '1.5',
                marginBottom: '15px'
              }}>
                {case_.description}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#6b7280'
              }}>
                <span>Assigned to: <strong>{case_.assignedTo}</strong></span>
                <span>Created: {new Date(case_.dateCreated).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'white'
          }}>
            <h3 style={{
              fontSize: '24px',
              marginBottom: '10px',
              opacity: 0.8
            }}>
              No cases found
            </h3>
            <p style={{
              fontSize: '16px',
              opacity: 0.6
            }}>
              {searchTerm || selectedFilter !== 'All' 
                ? 'Try adjusting your search terms or filters.' 
                : 'Create your first case to get started.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListOfCases;