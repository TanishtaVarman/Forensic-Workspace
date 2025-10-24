import React, { useState, useEffect , useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

const CaseDetail = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddNote, setShowAddNote] = useState(false);
  const [showEditNote, setShowEditNote] = useState(false);
  const [editingNoteIndex, setEditingNoteIndex] = useState(null);
  const [newNote, setNewNote] = useState({ author: '', content: '' });
  const [editMode, setEditMode] = useState({});
  const [editData, setEditData] = useState({});
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [newEvidence, setNewEvidence] = useState({ name: '', type: 'Physical', file: null });

  const allCases = [
  {
    id: 'CASE-001',
    title: 'Digital Fraud Investigation',
    status: 'Ongoing',
    priority: 'High',
    dateCreated: '2024-12-01',
    assignedTo: 'Agent Smith',
    description: 'Investigation of suspected digital fraud involving cryptocurrency transactions',
    category: 'Financial Crime',
    location: 'New York, NY',
    evidence: [
      { id: 1, type: 'Digital', name: 'Blockchain transaction logs', date: '2024-12-01', status: 'Analyzed' },
      { id: 2, type: 'Document', name: 'Bank transfer records', date: '2024-12-03', status: 'Under Review' }
    ],
    timeline: [
      { date: '2024-12-01', event: 'Case opened', description: 'Report from financial institution about suspicious transfers' },
      { date: '2024-12-03', event: 'Blockchain analysis', description: 'Identified wallet cluster connected to darknet marketplace' }
    ],
    suspects: [
      { name: 'Alexei Petrov', age: 32, status: 'Person of Interest', lastKnown: 'Brighton Beach, NY' }
    ],
    notes: [
      { id: 1, date: '2024-12-01', author: 'Agent Smith', content: 'Initial analysis shows $4.2M moved through mixing service' }
    ]
  },
  {
    id: 'CASE-002',
    title: 'Data Breach Analysis',
    status: 'Active',
    priority: 'Medium',
    dateCreated: '2024-11-28',
    assignedTo: 'Agent Johnson',
    description: 'Analysis of corporate data breach incident',
    category: 'Cybercrime',
    location: 'San Francisco, CA',
    evidence: [
      { id: 1, type: 'Digital', name: 'Server memory dump', date: '2024-11-28', status: 'Analyzed' },
      { id: 2, type: 'Digital', name: 'IDS alerts', date: '2024-11-29', status: 'Processed' }
    ],
    timeline: [
      { date: '2024-11-28', event: 'Breach detected', description: 'SOC team identified exfiltration activity' },
      { date: '2024-11-30', event: 'APT attribution', description: 'TTPs match known threat actor TA505' }
    ],
    suspects: [
      { name: 'N/A', age: 'N/A', status: 'Unidentified', lastKnown: 'IPs routed through Belarus' }
    ],
    notes: [
      { id: 1, date: '2024-11-28', author: 'Agent Johnson', content: 'Zero-day exploit suspected in VPN appliance' }
    ]
  },
  {
    id: 'CASE-003',
    title: 'Downtown Homicide Investigation',
    status: 'Active',
    priority: 'Critical',
    dateCreated: '2024-12-05',
    assignedTo: 'Detective Martinez',
    description: 'Fatal shooting incident at downtown business district - multiple witnesses',
    category: 'Homicide',
    location: 'Chicago, IL',
    evidence: [
      { id: 1, type: 'Firearm', name: '9mm shell casings (12)', date: '2024-12-05', status: 'Ballistics Testing' },
      { id: 2, type: 'Digital', name: 'Surveillance footage', date: '2024-12-05', status: 'Enhancement Pending' },
      { id: 3, type: 'Biological', name: 'Blood sample (victim)', date: '2024-12-05', status: 'DNA Analyzed' }
    ],
    timeline: [
      { date: '2024-12-05', event: '911 call received', description: 'Multiple reports of shots fired near Wacker Dr.' },
      { date: '2024-12-05', event: 'Victim pronounced', description: 'Male victim DOA with multiple GSWs to torso' },
      { date: '2024-12-06', event: 'Gang connection', description: 'Victim identified as member of Latin Kings organization' }
    ],
    suspects: [
      { name: 'Javier "Flaco" Mendez', age: 24, status: 'Wanted', lastKnown: 'Pilsen neighborhood' },
      { name: 'Unknown accomplice', age: 'N/A', status: 'At Large', lastKnown: 'Seen fleeing westbound' }
    ],
    notes: [
      { id: 1, date: '2024-12-05', author: 'Det. Martinez', content: 'Witnesses describe shooter wearing black hoodie and red sneakers' },
      { id: 2, date: '2024-12-06', author: 'Det. Martinez', content: 'Possible connection to ongoing gang turf war - notify gang unit' }
    ]
  },
  {
    id: 'CASE-004',
    title: 'Domestic Violence Homicide',
    status: 'Closed',
    priority: 'High',
    dateCreated: '2024-11-22',
    assignedTo: 'Detective Thompson',
    description: 'Victim found deceased at residence - suspected domestic violence escalation',
    category: 'Homicide',
    location: 'Seattle, WA',
    evidence: [
      { id: 1, type: 'Weapon', name: 'Kitchen knife', date: '2024-11-22', status: 'Fingerprints Analyzed' },
      { id: 2, type: 'Document', name: 'Restraining order', date: '2024-11-22', status: 'Filed' },
      { id: 3, type: 'Digital', name: '911 call recording', date: '2024-11-22', status: 'Enhanced' }
    ],
    timeline: [
      { date: '2024-11-22', event: 'Welfare check', description: 'Neighbor reported hearing argument followed by silence' },
      { date: '2024-11-22', event: 'Suspect in custody', description: 'Husband apprehended at bus station with bloody clothing' },
      { date: '2024-11-23', event: 'Confession', description: 'Suspect admitted to crime during interrogation' }
    ],
    suspects: [
      { name: 'Michael R. Thompson', age: 42, status: 'In Custody', lastKnown: 'King County Jail' }
    ],
    notes: [
      { id: 1, date: '2024-11-22', author: 'Det. Thompson', content: 'Victim had filed 3 prior DV reports this year' },
      { id: 2, date: '2024-11-23', author: 'Det. Thompson', content: 'Suspect claims "temporary insanity" - awaiting psych eval' }
    ]
  },
  {
    id: 'CASE-005',
    title: 'Park Murder Investigation',
    status: 'Cold',
    priority: 'Medium',
    dateCreated: '2024-11-18',
    assignedTo: 'Detective Rodriguez',
    description: 'Body discovered in city park - forensic evidence under review',
    category: 'Homicide',
    location: 'Miami, FL',
    evidence: [
      { id: 1, type: 'Biological', name: 'DNA sample (unknown)', date: '2024-11-18', status: 'CODIS Search Pending' },
      { id: 2, type: 'Physical', name: 'Partial shoe print', date: '2024-11-19', status: 'Analysis Complete' },
      { id: 3, type: 'Toxicology', name: 'Blood work', date: '2024-11-20', status: 'Results Pending' }
    ],
    timeline: [
      { date: '2024-11-18', event: 'Body discovered', description: 'Jogger found victim behind maintenance shed' },
      { date: '2024-11-19', event: 'Autopsy', description: 'Cause of death: strangulation with ligature' },
      { date: '2024-11-25', event: 'No new leads', description: 'Case reclassified to cold status' }
    ],
    suspects: [
      { name: 'Unknown', age: 'N/A', status: 'Unidentified', lastKnown: 'N/A' }
    ],
    notes: [
      { id: 1, date: '2024-11-18', author: 'Det. Rodriguez', content: 'Victim identified as local sex worker - possible serial pattern?' },
      { id: 2, date: '2024-11-20', author: 'Det. Rodriguez', content: 'Check similar cases in Broward County database' }
    ]
  },
  {
    id: 'CASE-006',
    title: 'Suspicious Package Investigation',
    status: 'Closed',
    priority: 'High',
    dateCreated: '2024-11-20',
    assignedTo: 'Agent Tanner',
    description: 'Bomb threat at federal building - package rendered safe, suspect in custody',
    category: 'Terrorism',
    location: 'Washington, D.C.',
    evidence: [
      { id: 1, type: 'Device', name: 'Disarmed IED', date: '2024-11-20', status: 'Forensic Analysis Complete' },
      { id: 2, type: 'Digital', name: 'Threat email metadata', date: '2024-11-20', status: 'Traced' },
      { id: 3, type: 'Document', name: 'Suspect manifesto', date: '2024-11-21', status: 'Analyzed' }
    ],
    timeline: [
      { date: '2024-11-20', event: 'Package discovered', description: 'Mailroom staff identified suspicious package' },
      { date: '2024-11-20', event: 'Bomb squad deployed', description: 'Device rendered safe with controlled detonation' },
      { date: '2024-11-21', event: 'Arrest made', description: 'Suspect apprehended at Arlington residence' }
    ],
    suspects: [
      { name: 'Trevor W. McAllister', age: 38, status: 'In Custody', lastKnown: 'Alexandria Detention Center' }
    ],
    notes: [
      { id: 1, date: '2024-11-20', author: 'Agent Tanner', content: 'Device construction matches anarchist cookbook design' },
      { id: 2, date: '2024-11-21', author: 'Agent Tanner', content: 'Suspect has prior arrests for anti-government protests' }
    ]
  },
  {
    id: 'CASE-007',
    title: 'Online Terrorist Recruitment',
    status: 'Monitoring',
    priority: 'High',
    dateCreated: '2024-11-25',
    assignedTo: 'Agent Chen',
    description: 'Monitoring suspected terrorist recruitment activities on social media platforms',
    category: 'Counterterrorism',
    location: 'Online',
    evidence: [
      { id: 1, type: 'Digital', name: 'Encrypted chat logs', date: '2024-11-25', status: 'Decryption Pending' },
      { id: 2, type: 'Document', name: 'IP address mapping', date: '2024-11-26', status: 'Analysis Complete' },
      { id: 3, type: 'Digital', name: 'Payment trail', date: '2024-11-27', status: 'Tracking' }
    ],
    timeline: [
      { date: '2024-11-25', event: 'TIP report', description: 'Informant provided chat channel information' },
      { date: '2024-11-26', event: 'Warrant issued', description: 'FISA court approved surveillance' },
      { date: '2024-11-28', event: 'Identified nodes', description: '3 US-based individuals making contact' }
    ],
    suspects: [
      { name: 'Username: "LionOfTruth"', age: 'N/A', status: 'Monitoring', lastKnown: 'VPN exit node in Turkey' },
      { name: 'Username: "DesertFox"', age: 'N/A', status: 'Monitoring', lastKnown: 'Proxy server in Malaysia' }
    ],
    notes: [
      { id: 1, date: '2024-11-25', author: 'Agent Chen', content: 'Channel promoting extremist ideology to US military veterans' },
      { id: 2, date: '2024-11-27', author: 'Agent Chen', content: 'Possible connection to recent radicalization cases in Texas' }
    ]
  },
  {
    id: 'CASE-008',
    title: 'Child Abduction Investigation',
    status: 'Active',
    priority: 'Critical',
    dateCreated: '2024-12-04',
    assignedTo: 'Agent Collins',
    description: 'Missing 8-year-old child case - investigation stalled due to lack of evidence',
    category: 'Missing Person',
    location: 'Denver, CO',
    evidence: [
      { id: 1, type: 'Digital', name: 'Home security footage', date: '2024-12-04', status: 'Enhanced' },
      { id: 2, type: 'Biological', name: 'Hair sample (bedroom)', date: '2024-12-05', status: 'DNA Analysis' },
      { id: 3, type: 'Physical', name: 'Bicycle', date: '2024-12-04', status: 'Processed' }
    ],
    timeline: [
      { date: '2024-12-04', event: 'AMBER Alert', description: 'Child last seen walking home from school' },
      { date: '2024-12-05', event: 'Search conducted', description: 'K-9 units covered 3-mile radius - no results' },
      { date: '2024-12-06', event: 'Media appeal', description: 'Parents made public plea for information' }
    ],
    suspects: [
      { name: 'Registered sex offender', age: 47, status: 'Cleared', lastKnown: 'Verified alibi' },
      { name: 'Unknown', age: 'N/A', status: 'Active Lead', lastKnown: 'White van reported near school' }
    ],
    notes: [
      { id: 1, date: '2024-12-04', author: 'Agent Collins', content: 'No signs of forced entry at home - possible grooming situation?' },
      { id: 2, date: '2024-12-06', author: 'Agent Collins', content: 'Coordinating with NCMEC for national exposure' }
    ]
  }
];

  const currentCase = useMemo(() => {
  return allCases.find(c => c.id === caseId);
}, [allCases, caseId]);

  const [notes, setNotes] = useState(currentCase?.notes || []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);


useEffect(() => {
  if (currentCase) {
    setNotes(currentCase.notes || []);
  }
}, [currentCase]);


  const toggleEditMode = (section, id = null) => {
    const key = id ? `${section}-${id}` : section;
    setEditMode(prev => ({
      ...prev,
      [key]: !Boolean(prev[key])
    }));

    if (section === 'header' && !editMode[section]) {
      setEditData({
        title: currentCase.title,
        status: currentCase.status,
        priority: currentCase.priority,
        assignedTo: currentCase.assignedTo,
        category: currentCase.category,
        location: currentCase.location,
        description: currentCase.description
      });
    }
  };

  const saveEdit = (section, id = null) => {
    console.log('Saving changes for:', section, editData);
    toggleEditMode(section, id);
  };

  const addEvidence = () => {
    const evidence = {
      ...newEvidence,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'Processing'
    };
    console.log('Adding evidence:', evidence);
    setNewEvidence({ name: '', type: 'Physical', file: null });
    setShowAddEvidence(false);
  };

  const viewFile = (evidence) => {
    if (evidence.file) {
      const url = URL.createObjectURL(evidence.file);
      window.open(url, '_blank');
    }
  };

  const addNote = () => {
    const note = {
      ...newNote,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setNotes([...notes, note]);
    setNewNote({ author: '', content: '' });
    setShowAddNote(false);
  };

  const editNote = (index) => {
    setEditingNoteIndex(index);
    setNewNote(notes[index]);
    setShowEditNote(true);
  };

  const updateNote = () => {
    const updatedNotes = [...notes];
    updatedNotes[editingNoteIndex] = {
      ...newNote,
      date: notes[editingNoteIndex].date 
    };
    setNotes(updatedNotes);
    setNewNote({ author: '', content: '' });
    setShowEditNote(false);
    setEditingNoteIndex(null);
  };

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  const cancelEdit = () => {
    setShowEditNote(false);
    setEditingNoteIndex(null);
    setNewNote({ author: '', content: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Closed': return '#10b981'; 
      case 'Open': return '#eab308';
      case 'Ongoing': return '#ef4444';
      case 'Dead': return '#8b4513';
      case 'Reviewing': return '#f97316';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getEvidenceStatusColor = (status) => {
    switch (status) {
      case 'Analyzed': return '#10b981';
      case 'Under Review': return '#f59e0b';
      case 'Processing': return '#3b82f6';
      case 'Ballistics Testing': return '#8b5cf6';
      case 'DNA Analysis': return '#ec4899';
      case 'Forensic Analysis': return '#f97316';
      case 'Documented': return '#10b981';
      case 'Monitoring': return '#3b82f6';
      case 'Decryption Pending': return '#f59e0b';
      case 'Tracking': return '#8b5cf6';
      case 'Inconsistent': return '#ef4444';
      case 'No Leads': return '#6b7280';
      case 'Rendered Safe': return '#10b981';
      case 'Traced': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  if (!currentCase) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h2>Case {caseId} Not Found</h2>
      <p style={{ marginBottom: '20px' }}>The requested case does not exist or you don't have permission to view it.</p>
      <button 
        onClick={() => navigate('/dashboard')} 
        style={{ 
          padding: '10px 20px', 
          marginTop: '20px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          ← Back to Dashboard
        </button>
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
          Order ❄️
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            {editMode.header ? (
              <input
                value={editData.title || ''}
                onChange={(e) => setEditData({...editData, title: e.target.value})}
                style={{ fontSize: '28px', fontWeight: 'bold', border: '1px solid #ccc', padding: '5px', width: '100%' }}
              />
            ) : (
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
                {currentCase.title}
              </h1>
            )}
            <p style={{ margin: '10px 0', fontSize: '16px', color: '#6b7280', fontWeight: '500' }}>
              Case ID: {currentCase.id}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            {editMode.header ? (
              <>
                <select
                  value={editData.status || ''}
                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                  style={{ padding: '8px', borderRadius: '4px' }}
                >
                  <option value="Open">Open</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Closed">Closed</option>
                  <option value="Dead">Dead</option>
                  <option value="Reviewing">Reviewing</option>
                </select>
                <select
                  value={editData.priority || ''}
                  onChange={(e) => setEditData({...editData, priority: e.target.value})}
                  style={{ padding: '8px', borderRadius: '4px' }}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </>
            ) : (
              <>
                <span style={{
                  backgroundColor: getStatusColor(currentCase.status),
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {currentCase.status}
                </span>
                <span style={{
                  backgroundColor: getPriorityColor(currentCase.priority),
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {currentCase.priority} Priority
                </span>
              </>
            )}
            <button
              onClick={() => editMode.header ? saveEdit('header') : toggleEditMode('header')}
              style={{
                padding: '8px 16px',
                backgroundColor: editMode.header ? '#10b981' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {editMode.header ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px'
        }}>
          <div>
            <strong style={{ color: '#374151' }}>Assigned To:</strong>
            {editMode.header ? (
              <input
                value={editData.assignedTo || ''}
                onChange={(e) => setEditData({...editData, assignedTo: e.target.value})}
                style={{ display: 'block', marginTop: '5px', padding: '4px', width: '100%' }}
              />
            ) : (
              <p style={{ margin: '5px 0 0 0', color: '#6b7280' }}>{currentCase.assignedTo}</p>
            )}
          </div>
          <div>
            <strong style={{ color: '#374151' }}>Date Created:</strong>
            <p style={{ margin: '5px 0 0 0', color: '#6b7280' }}>{new Date(currentCase.dateCreated).toLocaleDateString()}</p>
          </div>
          <div>
            <strong style={{ color: '#374151' }}>Category:</strong>
            {editMode.header ? (
              <input
                value={editData.category || ''}
                onChange={(e) => setEditData({...editData, category: e.target.value})}
                style={{ display: 'block', marginTop: '5px', padding: '4px', width: '100%' }}
              />
            ) : (
              <p style={{ margin: '5px 0 0 0', color: '#6b7280' }}>{currentCase.category}</p>
            )}
          </div>
          <div>
            <strong style={{ color: '#374151' }}>Location:</strong>
            {editMode.header ? (
              <input
                value={editData.location || ''}
                onChange={(e) => setEditData({...editData, location: e.target.value})}
                style={{ display: 'block', marginTop: '5px', padding: '4px', width: '100%' }}
              />
            ) : (
              <p style={{ margin: '5px 0 0 0', color: '#6b7280' }}>{currentCase.location}</p>
            )}
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <strong style={{ color: '#374151' }}>Description:</strong>
          {editMode.header ? (
            <textarea
              value={editData.description || ''}
              onChange={(e) => setEditData({...editData, description: e.target.value})}
              style={{ 
                display: 'block', 
                marginTop: '5px', 
                padding: '8px', 
                width: '100%', 
                minHeight: '60px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
          ) : (
            <p style={{ margin: '5px 0 0 0', color: '#6b7280' }}>{currentCase.description}</p>
          )}
        </div>
      </div>

      <div style={{
        display: 'flex',
        marginBottom: '30px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '8px',
        backdropFilter: 'blur(10px)'
      }}>
        {['overview', 'evidence', 'timeline', 'suspects', 'notes'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: activeTab === tab ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
              color: activeTab === tab ? '#1f2937' : 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'capitalize',
              transition: 'all 0.3s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '30px',
        minHeight: '400px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        {activeTab === 'overview' && (
          <div>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
              Case Overview
            </h3>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#4b5563', marginBottom: '30px' }}>
              {currentCase.description}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#374151' }}>Quick Stats</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>Evidence Items: <strong>{currentCase.evidence.length}</strong></div>
                  <div>Timeline Events: <strong>{currentCase.timeline.length}</strong></div>
                  <div>Suspects: <strong>{currentCase.suspects.length}</strong></div>
                  <div>Notes: <strong>{notes.length}</strong></div>
                </div>
              </div>
              
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#374151' }}>Recent Activity</h4>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {currentCase.timeline.slice(-3).reverse().map((event, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                      <strong>{event.date}</strong>: {event.event}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evidence' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
                Evidence
              </h3>
              <button
                onClick={() => setShowAddEvidence(true)}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Add Evidence
              </button>
            </div>

            {showAddEvidence && (
              <div style={{ 
                backgroundColor: '#f8fafc', 
                padding: '20px', 
                borderRadius: '12px', 
                marginBottom: '20px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ marginBottom: '15px' }}>Add New Evidence</h4>
                <div style={{ display: 'grid', gap: '15px' }}>
                  <input
                    type="text"
                    placeholder="Evidence name"
                    value={newEvidence.name}
                    onChange={(e) => setNewEvidence({...newEvidence, name: e.target.value})}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                  <select
                    value={newEvidence.type}
                    onChange={(e) => setNewEvidence({...newEvidence, type: e.target.value})}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="Physical">Physical</option>
                    <option value="Digital">Digital</option>
                    <option value="Document">Document</option>
                    <option value="Photo">Photo</option>
                    <option value="Video">Video</option>
                  </select>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.mp4,.mov,.avi"
                    onChange={(e) => setNewEvidence({...newEvidence, file: e.target.files[0]})}
                    style={{ padding: '8px' }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={addEvidence}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Add Evidence
                    </button>
                    <button
                      onClick={() => {
                        setShowAddEvidence(false);
                        setNewEvidence({ name: '', type: 'Physical', file: null });
                      }}
                      style={{
                        backgroundColor: '#6b7280',
                        color: 'white',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gap: '15px' }}>
              {currentCase.evidence.map((item) => (
                <div key={item.id} style={{
                  padding: '20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 5px 0', color: '#374151' }}>{item.name}</h4>
                      <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>
                        Type: {item.type} | Collected: {item.date}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        backgroundColor: getEvidenceStatusColor(item.status),
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
              Timeline
            </h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              {currentCase.timeline.map((event, index) => (
                <div key={index} style={{
                  padding: '20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  borderLeft: '4px solid #3b82f6'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, color: '#374151', fontSize: '16px', fontWeight: '600' }}>
                      {event.event}
                    </h4>
                    <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                      {event.date}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'suspects' && (
          <div>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
              Suspects
            </h3>
            <div style={{ display: 'grid', gap: '20px' }}>
              {currentCase.suspects.map((suspect, index) => (
                <div key={index} style={{
                  padding: '25px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                      <h4 style={{ margin: 0, color: '#374151', fontSize: '18px', fontWeight: '600' }}>
                        {suspect.name}
                      </h4>
                      <span style={{
                        backgroundColor: suspect.status === 'Person of Interest' ? '#f59e0b' : '#ef4444',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {suspect.status}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                      <div>
                        <strong style={{ color: '#374151', fontSize: '14px' }}>Age:</strong>
                        <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>{suspect.age}</p>
                      </div>
                      <div>
                        <strong style={{ color: '#374151', fontSize: '14px' }}>Last Known Location:</strong>
                        <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>{suspect.lastKnown}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
                  Notes
                </h3>
                <button
                  onClick={() => setShowAddNote(true)}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Add Note
                </button>
              </div>

              {showAddNote && (
                <div style={{ 
                  backgroundColor: '#f8fafc', 
                  padding: '20px', 
                  borderRadius: '12px', 
                  marginBottom: '20px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h4 style={{ marginBottom: '15px' }}>Add New Note</h4>
                  <div style={{ display: 'grid', gap: '15px' }}>
                    <input
                      type="text"
                      placeholder="Author name"
                      value={newNote.author}
                      onChange={(e) => setNewNote({...newNote, author: e.target.value})}
                      style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <textarea
                      placeholder="Note content"
                      value={newNote.content}
                      onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                      style={{ 
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: '1px solid #ccc',
                        minHeight: '100px',
                        resize: 'vertical'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={addNote}
                        style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        Add Note
                      </button>
                      <button
                        onClick={() => {
                          setShowAddNote(false);
                          setNewNote({ author: '', content: '' });
                        }}
                        style={{
                          backgroundColor: '#6b7280',
                          color: 'white',
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showEditNote && (
                <div style={{ 
                  backgroundColor: '#f8fafc', 
                  padding: '20px', 
                  borderRadius: '12px', 
                  marginBottom: '20px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h4 style={{ marginBottom: '15px' }}>Edit Note</h4>
                  <div style={{ display: 'grid', gap: '15px' }}>
                    <input
                      type="text"
                      placeholder="Author name"
                      value={newNote.author}
                      onChange={(e) => setNewNote({...newNote, author: e.target.value})}
                      style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <textarea
                      placeholder="Note content"
                      value={newNote.content}
                      onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                      style={{ 
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: '1px solid #ccc',
                        minHeight: '100px',
                        resize: 'vertical'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={updateNote}
                        style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        Update Note
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{
                          backgroundColor: '#6b7280',
                          color: 'white',
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gap: '15px' }}>
                {notes.map((note, index) => (
                  <div key={note.id} style={{
                    padding: '20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', color: '#374151', fontSize: '16px', fontWeight: '600' }}>
                          {note.author}
                        </h4>
                        <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                          {note.date}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => editNote(index)}
                          style={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            padding: '4px 8px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteNote(index)}
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            padding: '4px 8px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default CaseDetail;
