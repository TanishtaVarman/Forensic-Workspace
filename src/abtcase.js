class CaseDetailsManager {
    constructor() {
        // Sample database of cases
        this.caseDatabase = {
            'CASE-001': {
                id: 'CASE-001',
                title: 'Digital Fraud Investigation',
                status: 'Open',
                priority: 'High',
                assignedTo: 'Detective John',
                dateCreated: '2025-05-01',
                lastUpdated: '2025-05-25',
                description: 'Investigation into suspected digital fraud involving phishing.',
                victim: {
                    name: 'Alice Johnson',
                    age: 34,
                    address: '123 Maple St',
                    phone: '555-1234'
                },
                suspect: {
                    name: 'Unknown',
                    aliases: ['PhisherX', 'CyberThief'],
                    knownAddresses: ['N/A'],
                    previousCrimes: ['None']
                },
                evidence: [
                    {
                        type: 'Email Logs',
                        description: 'Suspicious phishing emails',
                        location: 'Server Logs',
                        status: 'Collected',
                        chainOfCustody: 'Signed by IT Dept'
                    },
                    {
                        type: 'IP Addresses',
                        description: 'Source IPs linked to phishing',
                        location: 'Network Firewall',
                        status: 'Analyzed',
                        chainOfCustody: 'Signed by Cybersecurity Team'
                    }
                ],
                timeline: [
                    {
                        date: '2025-05-01',
                        time: '09:00',
                        event: 'Case Opened',
                        details: 'Initial report received and case assigned.'
                    },
                    {
                        date: '2025-05-05',
                        time: '14:30',
                        event: 'Evidence Collected',
                        details: 'Email logs and IP addresses collected for analysis.'
                    },
                    {
                        date: '2025-05-15',
                        time: '11:00',
                        event: 'Suspect Identified',
                        details: 'Alias "PhisherX" linked to known cybercriminal activity.'
                    }
                ],
                forensics: {
                    digitalForensics: {
                        status: 'In Progress',
                        progress: 65,
                        findings: [
                            'Recovered deleted emails',
                            'Identified phishing website',
                            'Analyzed IP traffic'
                        ],
                        tools: ['EnCase', 'FTK', 'Wireshark']
                    },
                    forensicAccounting: {
                        status: 'Pending',
                        progress: 0,
                        findings: [],
                        tools: []
                    }
                },
                progress: 65,
                nextSteps: [
                    'Interview suspect alias PhisherX',
                    'Request subpoenas for hosting providers',
                    'Analyze additional server logs'
                ]
            },
            'CASE-002': {
                id: 'CASE-002',
                title: 'Data Breach Analysis',
                status: 'Closed',
                priority: 'Medium',
                assignedTo: 'Detective Lisa',
                dateCreated: '2025-04-20',
                lastUpdated: '2025-05-10',
                description: 'Analysis of a recent data breach affecting customer information.',
                victim: {
                    name: 'TechCorp',
                    contact: 'security@techcorp.com'
                },
                suspect: {
                    name: 'Unknown',
                    aliases: [],
                    knownAddresses: [],
                    previousCrimes: []
                },
                evidence: [
                    {
                        type: 'Server Logs',
                        description: 'Unauthorized access logs',
                        location: 'Main Server',
                        status: 'Reviewed'
                    }
                ],
                timeline: [
                    {
                        date: '2025-04-20',
                        time: '08:00',
                        event: 'Case Opened',
                        details: 'Reported data breach by TechCorp security team.'
                    },
                    {
                        date: '2025-05-05',
                        time: '16:00',
                        event: 'Breach Contained',
                        details: 'Security patches applied and access blocked.'
                    }
                ],
                forensics: {
                    networkForensics: {
                        status: 'Completed',
                        progress: 100,
                        findings: [
                            'Identified malware entry point',
                            'Traced attacker IP addresses'
                        ],
                        tools: ['Snort', 'Wireshark']
                    }
                },
                progress: 100,
                outcome: 'Perpetrator identified and case closed with successful prosecution.'
            }
            // Add more cases as needed...
        };

        this.currentCase = null;

        this.attachEventListeners();
    }

    // Attach event listeners (your existing method)
    attachEventListeners() {
        // Close modal events
        document.addEventListener('click', (e) => {
            if (e.target.id === 'closeCaseModal' || e.target.id === 'closeModal') {
                this.closeModal();
            }
            if (e.target.id === 'caseDetailsModal') {
                this.closeModal();
            }
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Add click listeners to case cards
        this.attachCaseCardListeners();
    }

    // Attach listeners to existing case cards (your existing method)
    attachCaseCardListeners() {
        setTimeout(() => {
            document.querySelectorAll('*').forEach(element => {
                const text = element.textContent;
                if (text.includes('CASE-001') || text.includes('Digital Fraud Investigation')) {
                    element.style.cursor = 'pointer';
                    element.addEventListener('click', () => this.openCaseDetails('CASE-001'));
                }
                if (text.includes('CASE-002') || text.includes('Data Breach Analysis')) {
                    element.style.cursor = 'pointer';
                    element.addEventListener('click', () => this.openCaseDetails('CASE-002'));
                }
                if (text.includes('CASE-003') || text.includes('Mobile Device Forensics')) {
                    element.style.cursor = 'pointer';
                    element.addEventListener('click', () => this.openCaseDetails('CASE-003'));
                }
            });
        }, 1000);
    }

    // Open case details modal (your existing method)
    openCaseDetails(caseId) {
        const caseData = this.caseDatabase[caseId];
        if (!caseData) {
            console.error('Case not found:', caseId);
            return;
        }

        this.currentCase = caseData;
        this.populateModal(caseData);
        document.getElementById('caseDetailsModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // Close modal (your existing method)
    closeModal() {
        document.getElementById('caseDetailsModal').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    // Populate modal with case data (your existing method)
    populateModal(caseData) {
        document.getElementById('caseTitle').textContent = caseData.title;
        document.getElementById('caseId').textContent = caseData.id;
        document.getElementById('caseStatus').textContent = caseData.status;
        document.getElementById('caseStatus').className = `status-badge status-${caseData.status.toLowerCase()}`;
        document.getElementById('casePriority').textContent = caseData.priority;
        document.getElementById('casePriority').className = `priority-badge priority-${caseData.priority.toLowerCase()}`;
        document.getElementById('assignedTo').textContent = caseData.assignedTo;
        document.getElementById('dateCreated').textContent = caseData.dateCreated;
        document.getElementById('lastUpdated').textContent = caseData.lastUpdated;
        document.getElementById('caseDescription').textContent = caseData.description;

        this.populateVictimInfo(caseData.victim);
        this.populateSuspectInfo(caseData.suspect);
        this.populateEvidence(caseData.evidence);
        this.populateTimeline(caseData.timeline);
        this.populateForensics(caseData.forensics);
        this.populateProgress(caseData);
    }

    // ... (Your existing populateVictimInfo, populateSuspectInfo, populateEvidence, populateTimeline, populateForensics, populateProgress methods stay unchanged)
}
