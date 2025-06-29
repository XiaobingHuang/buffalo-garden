import React, { useState } from 'react';
import Navigation from '../../components/Navigation';
import './SettingsPage.css';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Cashier' | 'Inventory Manager' | 'Compliance Officer';
  status: 'Active' | 'Inactive';
  lastLogin?: string;
  createdAt: string;
}

interface StoreInfo {
  storeName: string;
  licenseNumber: string;
  address: string;
  phone: string;
  email: string;
  operatingHours: string;
  logo?: string;
  footerNote: string;
}

interface ComplianceSettings {
  ageVerificationRequired: boolean;
  legalLimits: {
    flower: string;
    edibles: string;
  };
  reportToBioTrack: boolean;
  licenseExpiration: string;
  autoExportReports: {
    pdf: boolean;
    email: boolean;
  };
  coaStorage: boolean;
  autoFlagExpiredIds: boolean;
  autoFlagNearLimit: boolean;
}

interface POSSettings {
  defaultPaymentMethod: 'CARD' | 'CASH';
  receiptFormat: 'Printed' | 'Email' | 'Both';
  tipPrompt: boolean;
  taxes: boolean;
  roundPrices: '0.10' | '0.01' | 'none';
  discountPresets: string[];
}

interface Integration {
  name: string;
  status: 'Connected' | 'Not Connected' | 'Error';
  lastSync?: string;
  apiKey?: string;
}

interface SecuritySettings {
  passwordPolicy: 'Strong' | 'Medium' | 'Weak';
  twoFactorAuth: boolean;
  failedLoginLockout: {
    enabled: boolean;
    attempts: number;
    duration: number;
  };
  sessionTimeout: number;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('store-info');
  
  // Store Info State
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    storeName: 'Buffalo Roar Dispensary',
    licenseNumber: 'NY-2023-003154',
    address: '123 Hemp Street, Buffalo, NY',
    phone: '(123) 456-7890',
    email: 'owner@buffaloroar.com',
    operatingHours: 'Mon–Sat: 10am–8pm',
    footerNote: 'All products tested & compliant with NYS regulations'
  });

  // Team Members State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Jamie',
      email: 'jamie@buffaloroar.com',
      role: 'Owner',
      status: 'Active',
      lastLogin: '2025-01-15 14:30',
      createdAt: '2023-01-15'
    },
    {
      id: '2',
      name: 'Kai',
      email: 'kai@buffaloroar.com',
      role: 'Cashier',
      status: 'Active',
      lastLogin: '2025-01-15 16:45',
      createdAt: '2023-06-20'
    },
    {
      id: '3',
      name: 'Sam',
      email: 'sam@buffaloroar.com',
      role: 'Inventory Manager',
      status: 'Inactive',
      createdAt: '2023-08-10'
    }
  ]);

  // Compliance State
  const [compliance, setCompliance] = useState<ComplianceSettings>({
    ageVerificationRequired: true,
    legalLimits: {
      flower: '28g',
      edibles: '800mg'
    },
    reportToBioTrack: true,
    licenseExpiration: '2026-03-10',
    autoExportReports: {
      pdf: true,
      email: true
    },
    coaStorage: true,
    autoFlagExpiredIds: true,
    autoFlagNearLimit: true
  });

  // POS Settings State
  const [posSettings, setPOSSettings] = useState<POSSettings>({
    defaultPaymentMethod: 'CARD',
    receiptFormat: 'Both',
    tipPrompt: true,
    taxes: true,
    roundPrices: '0.01',
    discountPresets: ['10%', '20%', 'Loyalty Club']
  });

  // Integrations State
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      name: 'BioTrack NY',
      status: 'Connected',
      lastSync: '2025-01-15 17:00'
    },
    {
      name: 'Leafly Menu',
      status: 'Not Connected'
    },
    {
      name: 'Stripe Payments',
      status: 'Connected',
      lastSync: '2025-01-15 16:30'
    },
    {
      name: 'Mailchimp (Loyalty)',
      status: 'Not Connected'
    }
  ]);

  // Security State
  const [security, setSecurity] = useState<SecuritySettings>({
    passwordPolicy: 'Strong',
    twoFactorAuth: true,
    failedLoginLockout: {
      enabled: true,
      attempts: 5,
      duration: 30
    },
    sessionTimeout: 15
  });

  // Modal states
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Cashier' as TeamMember['role']
  });

  // Handle store info updates
  const handleStoreInfoUpdate = (field: keyof StoreInfo, value: string) => {
    setStoreInfo(prev => ({ ...prev, [field]: value }));
  };

  // Handle compliance updates
  const handleComplianceUpdate = (field: keyof ComplianceSettings, value: any) => {
    setCompliance(prev => ({ ...prev, [field]: value }));
  };

  // Handle POS settings updates
  const handlePOSUpdate = (field: keyof POSSettings, value: any) => {
    setPOSSettings(prev => ({ ...prev, [field]: value }));
  };

  // Handle team member actions
  const handleTeamMemberAction = (memberId: string, action: string) => {
    setTeamMembers(prev => prev.map(member => {
      if (member.id === memberId) {
        switch (action) {
          case 'suspend':
            return { ...member, status: 'Inactive' as const };
          case 'activate':
            return { ...member, status: 'Active' as const };
          case 'delete':
            return member; // Will be filtered out
          default:
            return member;
        }
      }
      return member;
    }).filter(member => member.id !== memberId || action !== 'delete'));
  };

  // Handle add new team member
  const handleAddMember = () => {
    if (newMember.name && newMember.email) {
      const member: TeamMember = {
        id: Date.now().toString(),
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        status: 'Active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTeamMembers(prev => [...prev, member]);
      setNewMember({ name: '', email: '', role: 'Cashier' });
      setShowAddMember(false);
    }
  };

  // Handle integration connection
  const handleIntegrationAction = (integrationName: string, action: string) => {
    setIntegrations(prev => prev.map(integration => {
      if (integration.name === integrationName) {
        if (action === 'connect') {
          return {
            ...integration,
            status: 'Connected' as const,
            lastSync: new Date().toLocaleString()
          };
        } else if (action === 'disconnect') {
          return {
            ...integration,
            status: 'Not Connected' as const,
            lastSync: undefined
          };
        }
      }
      return integration;
    }));
  };

  const tabs = [
    { id: 'store-info', label: 'Store Info', icon: '🏪' },
    { id: 'team-members', label: 'Team Members', icon: '👥' },
    { id: 'compliance', label: 'Compliance', icon: '🧾' },
    { id: 'pos-setup', label: 'POS Setup', icon: '🖨️' },
    { id: 'integrations', label: 'Integrations', icon: '🔌' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  const renderStoreInfo = () => (
    <div className="settings-content">
      <h2>🏪 Store Information</h2>
      <p className="settings-description">Basic details and contact info for the license & receipt headers</p>
      
      <div className="settings-form">
        <div className="form-group">
          <label>Store Name *</label>
          <input
            type="text"
            value={storeInfo.storeName}
            onChange={(e) => handleStoreInfoUpdate('storeName', e.target.value)}
            className="settings-input"
          />
        </div>
        
        <div className="form-group">
          <label>License Number *</label>
          <input
            type="text"
            value={storeInfo.licenseNumber}
            onChange={(e) => handleStoreInfoUpdate('licenseNumber', e.target.value)}
            className="settings-input"
          />
        </div>
        
        <div className="form-group">
          <label>Store Address *</label>
          <textarea
            value={storeInfo.address}
            onChange={(e) => handleStoreInfoUpdate('address', e.target.value)}
            className="settings-textarea"
            rows={3}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Contact Phone *</label>
            <input
              type="tel"
              value={storeInfo.phone}
              onChange={(e) => handleStoreInfoUpdate('phone', e.target.value)}
              className="settings-input"
            />
          </div>
          
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={storeInfo.email}
              onChange={(e) => handleStoreInfoUpdate('email', e.target.value)}
              className="settings-input"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Operating Hours</label>
          <input
            type="text"
            value={storeInfo.operatingHours}
            onChange={(e) => handleStoreInfoUpdate('operatingHours', e.target.value)}
            className="settings-input"
            placeholder="Mon–Sat: 10am–8pm"
          />
        </div>
        
        <div className="form-group">
          <label>Logo Upload</label>
          <div className="file-upload">
            <input type="file" accept="image/*" className="file-input" />
            <button type="button" className="upload-btn">📁 Choose File</button>
          </div>
        </div>
        
        <div className="form-group">
          <label>Footer Note</label>
          <textarea
            value={storeInfo.footerNote}
            onChange={(e) => handleStoreInfoUpdate('footerNote', e.target.value)}
            className="settings-textarea"
            rows={2}
            placeholder="All products tested & compliant with NYS regulations"
          />
        </div>
      </div>
    </div>
  );

  const renderTeamMembers = () => (
    <div className="settings-content">
      <div className="settings-header">
        <div>
          <h2>👥 Team Members</h2>
          <p className="settings-description">Manage who can access the system and what they can do</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowAddMember(true)}
        >
          ➕ Add Member
        </button>
      </div>
      
      <div className="team-members-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map(member => (
              <tr key={member.id}>
                <td>
                  <div className="member-info">
                    <span className="member-name">{member.name}</span>
                    <span className="member-email">{member.email}</span>
                  </div>
                </td>
                <td>
                  <span className={`role-badge ${member.role.toLowerCase()}`}>
                    {member.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${member.status.toLowerCase()}`}>
                    {member.status === 'Active' ? '✅' : '❌'} {member.status}
                  </span>
                </td>
                <td>{member.lastLogin || 'Never'}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn edit">Edit</button>
                    {member.status === 'Active' ? (
                      <button 
                        className="action-btn suspend"
                        onClick={() => handleTeamMemberAction(member.id, 'suspend')}
                      >
                        Suspend
                      </button>
                    ) : (
                      <button 
                        className="action-btn activate"
                        onClick={() => handleTeamMemberAction(member.id, 'activate')}
                      >
                        Activate
                      </button>
                    )}
                    <button 
                      className="action-btn delete"
                      onClick={() => handleTeamMemberAction(member.id, 'delete')}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="modal-overlay" onClick={() => setShowAddMember(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>➕ Add New Team Member</h3>
              <button className="modal-close" onClick={() => setShowAddMember(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                  placeholder="Full name"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  className="form-input"
                  placeholder="email@buffaloroar.com"
                />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value as TeamMember['role'] }))}
                  className="form-input"
                >
                  <option value="Cashier">Cashier</option>
                  <option value="Inventory Manager">Inventory Manager</option>
                  <option value="Compliance Officer">Compliance Officer</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddMember(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddMember}>
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCompliance = () => (
    <div className="settings-content">
      <h2>🧾 Compliance Settings</h2>
      <p className="settings-description">Manage seed-to-sale tracking, audit logs, legal limits</p>
      
      <div className="settings-form">
        <div className="settings-section">
          <h3>Age Verification</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={compliance.ageVerificationRequired}
                onChange={(e) => handleComplianceUpdate('ageVerificationRequired', e.target.checked)}
              />
              <span className="toggle-slider"></span>
              Age verification required
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Legal Purchase Limits</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Flower Limit</label>
              <input
                type="text"
                value={compliance.legalLimits.flower}
                onChange={(e) => handleComplianceUpdate('legalLimits', { ...compliance.legalLimits, flower: e.target.value })}
                className="settings-input"
              />
            </div>
            <div className="form-group">
              <label>Edibles Limit</label>
              <input
                type="text"
                value={compliance.legalLimits.edibles}
                onChange={(e) => handleComplianceUpdate('legalLimits', { ...compliance.legalLimits, edibles: e.target.value })}
                className="settings-input"
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Reporting</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={compliance.reportToBioTrack}
                onChange={(e) => handleComplianceUpdate('reportToBioTrack', e.target.checked)}
              />
              <span className="toggle-slider"></span>
              Report sales to BioTrack
            </label>
          </div>
          
          <div className="form-group">
            <label>License Expiration</label>
            <input
              type="date"
              value={compliance.licenseExpiration}
              onChange={(e) => handleComplianceUpdate('licenseExpiration', e.target.value)}
              className="settings-input"
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Auto-Export Reports</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={compliance.autoExportReports.pdf}
                onChange={(e) => handleComplianceUpdate('autoExportReports', { ...compliance.autoExportReports, pdf: e.target.checked })}
              />
              <span className="toggle-slider"></span>
              PDF Export
            </label>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={compliance.autoExportReports.email}
                onChange={(e) => handleComplianceUpdate('autoExportReports', { ...compliance.autoExportReports, email: e.target.checked })}
              />
              <span className="toggle-slider"></span>
              Email Export
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Additional Features</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={compliance.coaStorage}
                onChange={(e) => handleComplianceUpdate('coaStorage', e.target.checked)}
              />
              <span className="toggle-slider"></span>
              COA file storage (PDFs per batch)
            </label>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={compliance.autoFlagExpiredIds}
                onChange={(e) => handleComplianceUpdate('autoFlagExpiredIds', e.target.checked)}
              />
              <span className="toggle-slider"></span>
              Auto-flag expired IDs
            </label>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={compliance.autoFlagNearLimit}
                onChange={(e) => handleComplianceUpdate('autoFlagNearLimit', e.target.checked)}
              />
              <span className="toggle-slider"></span>
              Auto-flag near-limit customers
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPOSSetup = () => (
    <div className="settings-content">
      <h2>🖨️ POS Setup</h2>
      <p className="settings-description">Configure how the sales interface works in your store</p>
      
      <div className="settings-form">
        <div className="settings-section">
          <h3>Payment Settings</h3>
          <div className="form-group">
            <label>Default Payment Method</label>
            <select
              value={posSettings.defaultPaymentMethod}
              onChange={(e) => handlePOSUpdate('defaultPaymentMethod', e.target.value)}
              className="settings-input"
            >
              <option value="CARD">💳 Card</option>
              <option value="CASH">💵 Cash</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3>Receipt Settings</h3>
          <div className="form-group">
            <label>Receipt Format</label>
            <select
              value={posSettings.receiptFormat}
              onChange={(e) => handlePOSUpdate('receiptFormat', e.target.value)}
              className="settings-input"
            >
              <option value="Printed">Printed</option>
              <option value="Email">Email</option>
              <option value="Both">Both</option>
            </select>
          </div>
          
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={posSettings.tipPrompt}
                onChange={(e) => handlePOSUpdate('tipPrompt', e.target.checked)}
              />
              <span className="toggle-slider"></span>
              Tip prompt enabled
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Pricing Settings</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={posSettings.taxes}
                onChange={(e) => handlePOSUpdate('taxes', e.target.checked)}
              />
              <span className="toggle-slider"></span>
              Auto-apply taxes based on NYS
            </label>
          </div>
          
          <div className="form-group">
            <label>Round Prices</label>
            <select
              value={posSettings.roundPrices}
              onChange={(e) => handlePOSUpdate('roundPrices', e.target.value)}
              className="settings-input"
            >
              <option value="0.10">Nearest $0.10</option>
              <option value="0.01">Nearest $0.01</option>
              <option value="none">No rounding</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3>Discount Presets</h3>
          <div className="discount-presets">
            {posSettings.discountPresets.map((preset, index) => (
              <div key={index} className="discount-preset">
                <input
                  type="text"
                  value={preset}
                  onChange={(e) => {
                    const newPresets = [...posSettings.discountPresets];
                    newPresets[index] = e.target.value;
                    handlePOSUpdate('discountPresets', newPresets);
                  }}
                  className="settings-input"
                />
                <button 
                  className="remove-preset-btn"
                  onClick={() => {
                    const newPresets = posSettings.discountPresets.filter((_, i) => i !== index);
                    handlePOSUpdate('discountPresets', newPresets);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            <button 
              className="add-preset-btn"
              onClick={() => {
                const newPresets = [...posSettings.discountPresets, 'New Preset'];
                handlePOSUpdate('discountPresets', newPresets);
              }}
            >
              ➕ Add Preset
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="settings-content">
      <h2>🔌 Integrations</h2>
      <p className="settings-description">Third-party services that plug into the system</p>
      
      <div className="integrations-grid">
        {integrations.map(integration => (
          <div key={integration.name} className="integration-card">
            <div className="integration-header">
              <h3>{integration.name}</h3>
              <span className={`status-badge ${integration.status.toLowerCase().replace(' ', '-')}`}>
                {integration.status === 'Connected' ? '✅' : integration.status === 'Error' ? '⚠️' : '❌'} {integration.status}
              </span>
            </div>
            
            {integration.lastSync && (
              <p className="last-sync">Last sync: {integration.lastSync}</p>
            )}
            
            <div className="integration-actions">
              {integration.status === 'Connected' ? (
                <>
                  <button className="integration-btn view">View API Logs</button>
                  <button 
                    className="integration-btn disconnect"
                    onClick={() => handleIntegrationAction(integration.name, 'disconnect')}
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button 
                  className="integration-btn connect"
                  onClick={() => handleIntegrationAction(integration.name, 'connect')}
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="settings-content">
      <h2>🔒 Security Settings</h2>
      <p className="settings-description">Control login access, change passwords, and see audit trail</p>
      
      <div className="settings-form">
        <div className="settings-section">
          <h3>Password Policy</h3>
          <div className="form-group">
            <label>Password Strength</label>
            <select
              value={security.passwordPolicy}
              onChange={(e) => setSecurity(prev => ({ ...prev, passwordPolicy: e.target.value as any }))}
              className="settings-input"
            >
              <option value="Strong">Strong (min 8 chars, symbol)</option>
              <option value="Medium">Medium (min 6 chars)</option>
              <option value="Weak">Weak (min 4 chars)</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3>Two-Factor Authentication</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={security.twoFactorAuth}
                onChange={(e) => setSecurity(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
              2FA (Admin only) - SMS or App
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Login Security</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={security.failedLoginLockout.enabled}
                onChange={(e) => setSecurity(prev => ({ 
                  ...prev, 
                  failedLoginLockout: { ...prev.failedLoginLockout, enabled: e.target.checked }
                }))}
              />
              <span className="toggle-slider"></span>
              Failed login lockout
            </label>
          </div>
          
          {security.failedLoginLockout.enabled && (
            <div className="form-row">
              <div className="form-group">
                <label>Attempts</label>
                <input
                  type="number"
                  value={security.failedLoginLockout.attempts}
                  onChange={(e) => setSecurity(prev => ({ 
                    ...prev, 
                    failedLoginLockout: { ...prev.failedLoginLockout, attempts: parseInt(e.target.value) }
                  }))}
                  className="settings-input"
                />
              </div>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  value={security.failedLoginLockout.duration}
                  onChange={(e) => setSecurity(prev => ({ 
                    ...prev, 
                    failedLoginLockout: { ...prev.failedLoginLockout, duration: parseInt(e.target.value) }
                  }))}
                  className="settings-input"
                />
              </div>
            </div>
          )}
          
          <div className="form-group">
            <label>Session Timeout (minutes)</label>
            <input
              type="number"
              value={security.sessionTimeout}
              onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
              className="settings-input"
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Recent Logins</h3>
          <div className="recent-logins">
            <div className="login-entry">
              <span className="login-time">2025-01-15 14:30</span>
              <span className="login-ip">192.168.1.100</span>
              <span className="login-device">Chrome on MacBook</span>
            </div>
            <div className="login-entry">
              <span className="login-time">2025-01-15 10:15</span>
              <span className="login-ip">192.168.1.101</span>
              <span className="login-device">Safari on iPhone</span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Administrative Actions</h3>
          <div className="admin-actions">
            <button className="admin-btn">Change Owner Password</button>
            <button className="admin-btn">Export Full Audit Log</button>
            <button className="admin-btn">Download Compliance Reports</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'store-info':
        return renderStoreInfo();
      case 'team-members':
        return renderTeamMembers();
      case 'compliance':
        return renderCompliance();
      case 'pos-setup':
        return renderPOSSetup();
      case 'integrations':
        return renderIntegrations();
      case 'security':
        return renderSecurity();
      default:
        return renderStoreInfo();
    }
  };

  return (
    <div className="dashboard-container">
      <Navigation currentPage="settings" />
      <div className="dashboard-content">
        <div className="settings-page">
          <div className="settings-header">
            <h1>⚙️ Settings</h1>
          </div>

          <div className="settings-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="settings-main">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 