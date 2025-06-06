import React, { useState } from 'react';
import './NewCasePage.css';


function NewCasePage() {
  const [caseData, setCaseData] = useState({
    caseName: '',
    evidenceImages: [],
    medicalReports: '',
    caseTimeline: '',
    forensicReports: '',
    victimMedicalReport: '',
    criminalMedicalReport: '',
    victimFamilyInfo: '',
    criminalFamilyInfo: '',
    medicalAnalysis: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCaseData({ ...caseData, [name]: value });
  };

  const handleFileChange = (e) => {
    setCaseData({ ...caseData, evidenceImages: Array.from(e.target.files) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Case:", caseData);
    alert("New Case Submitted!");
  };

  const inputSections = [
    {
      title: "Case Information",
      icon: "📋",
      fields: [
        { name: "caseName", label: "Case Name", type: "text", required: true }
      ]
    },
    {
      title: "Evidence & Documentation",
      icon: "📁",
      fields: [
        { name: "evidenceImages", label: "Upload Evidence Images", type: "file", multiple: true },
        { name: "forensicReports", label: "Forensic Reports", type: "textarea" }
      ]
    },
    {
      title: "Medical Information",
      icon: "🏥",
      fields: [
        { name: "medicalReports", label: "Medical Reports", type: "textarea" },
        { name: "victimMedicalReport", label: "Victim Medical Report", type: "textarea" },
        { name: "criminalMedicalReport", label: "Criminal Medical Report", type: "textarea" },
        { name: "medicalAnalysis", label: "Medical Analysis", type: "textarea" }
      ]
    },
    {
      title: "Timeline & Investigation",
      icon: "⏰",
      fields: [
        { name: "caseTimeline", label: "Case Timeline", type: "textarea" }
      ]
    },
    {
      title: "Family Information",
      icon: "👥",
      fields: [
        { name: "victimFamilyInfo", label: "Victim Family Info", type: "textarea" },
        { name: "criminalFamilyInfo", label: "Criminal Family Info", type: "textarea" }
      ]
    }
  ];

  return (
    <div className="new-case-page">
      <div className="new-case-container">
     
        <div className="page-header">
          <h1>Create New Case</h1>
          <p>Enter case details and documentation</p>
        </div>

        <form onSubmit={handleSubmit}>
          {inputSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="form-section">
             
              <div className="section-header">
                <div className="section-icon">{section.icon}</div>
                <h3>{section.title}</h3>
              </div>

           
              <div className="section-fields">
                {section.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="form-group">
                    <label>
                      {field.label}
                      {field.required && <span className="required">*</span>}
                    </label>
                    
                    {field.type === 'file' ? (
                      <div className="file-upload-area">
                        <input
                          type="file"
                          multiple={field.multiple}
                          onChange={handleFileChange}
                          className="file-input"
                        />
                        <div className="file-upload-content">
                          <div className="upload-icon">📤</div>
                          <p>
                            {caseData.evidenceImages.length > 0 
                              ? `${caseData.evidenceImages.length} file(s) selected`
                              : 'Click to upload or drag and drop'
                            }
                          </p>
                        </div>
                      </div>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        name={field.name}
                        onChange={handleChange}
                        rows={4}
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                        value={caseData[field.name] || ''}
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        onChange={handleChange}
                        required={field.required}
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                        value={caseData[field.name] || ''}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

         
          <div className="submit-section">
            <button type="submit" className="submit-btn">
              <span className="btn-icon">🛡️</span>
              Save Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewCasePage;