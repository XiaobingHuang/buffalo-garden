import React, { useState, useEffect } from 'react';
import './CustomerModal.css';

interface Customer {
  id?: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  phoneNumber: string;
  email: string;
  preferredContact: 'sms' | 'email';
  idType: string;
  idNumber: string;
  idExpiry: string;
  verifiedBy: string;
  notes: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
  lastPurchase?: {
    date: string;
    amount: number;
  };
}

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  existingCustomer?: Customer | null;
  mode: 'add' | 'edit' | 'select';
  savedCustomers?: Customer[];
}

const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingCustomer,
  mode,
  savedCustomers = []
}) => {
  const [customer, setCustomer] = useState<Customer>({
    fullName: '',
    dateOfBirth: '',
    age: 0,
    phoneNumber: '',
    email: '',
    preferredContact: 'sms',
    idType: 'Driver\'s License',
    idNumber: '',
    idExpiry: '',
    verifiedBy: 'Jamie',
    notes: '',
    tags: []
  });

  const [ageWarning, setAgeWarning] = useState<string>('');
  const [availableTags] = useState<string[]>([
    'Regular', 'Medical', '420 Club', 'VIP', 'First Time', 'Delivery'
  ]);

  // Select mode state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  // Sample saved customers for demonstration
  const sampleCustomers: Customer[] = [
    {
      id: '1',
      fullName: 'John Doe',
      dateOfBirth: '1996-07-04',
      age: 28,
      phoneNumber: '(123) 456-7890',
      email: 'john@email.com',
      preferredContact: 'sms',
      idType: 'Driver\'s License',
      idNumber: 'NY123456789',
      idExpiry: '2027-03-01',
      verifiedBy: 'Jamie',
      notes: 'Good tipper, prefers indica strains',
      tags: ['Regular', 'Medical'],
      createdAt: new Date('2024-01-15'),
      lastPurchase: {
        date: '2025-06-15',
        amount: 32.00
      }
    },
    {
      id: '2',
      fullName: 'Jane Flower',
      dateOfBirth: '1983-03-12',
      age: 42,
      phoneNumber: '(555) 111-2233',
      email: 'jane.flower@email.com',
      preferredContact: 'email',
      idType: 'State ID',
      idNumber: 'NY876543210',
      idExpiry: '2026-08-10',
      verifiedBy: 'Sarah',
      notes: 'VIP customer, loves edibles',
      tags: ['VIP'],
      createdAt: new Date('2023-08-20'),
      lastPurchase: {
        date: '2025-06-01',
        amount: 98.00
      }
    },
    {
      id: '3',
      fullName: 'Jason Redman',
      dateOfBirth: '2003-11-08',
      age: 22,
      phoneNumber: '(321) 777-9911',
      email: 'jason.red@email.com',
      preferredContact: 'sms',
      idType: '',
      idNumber: '',
      idExpiry: '',
      verifiedBy: '',
      notes: 'New customer, needs ID verification',
      tags: ['First Time'],
      createdAt: new Date('2025-06-10'),
      lastPurchase: {
        date: '2025-06-10',
        amount: 45.00
      }
    }
  ];

  // Initialize customer data when modal opens
  useEffect(() => {
    if (existingCustomer && mode === 'edit') {
      setCustomer(existingCustomer);
    } else if (mode === 'add') {
      setCustomer({
        fullName: '',
        dateOfBirth: '',
        age: 0,
        phoneNumber: '',
        email: '',
        preferredContact: 'sms',
        idType: 'Driver\'s License',
        idNumber: '',
        idExpiry: '',
        verifiedBy: 'Jamie',
        notes: '',
        tags: []
      });
    }
  }, [existingCustomer, mode, isOpen]);

  // Filter customers for select mode
  useEffect(() => {
    if (mode === 'select') {
      const allCustomers = [...savedCustomers, ...sampleCustomers];
      const filtered = allCustomers.filter(customer => 
        customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, savedCustomers, mode]);

  // Calculate age from date of birth
  const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Handle date of birth change
  const handleDateOfBirthChange = (dob: string) => {
    const age = calculateAge(dob);
    setCustomer(prev => ({ ...prev, dateOfBirth: dob, age }));
    
    // Age validation
    if (age < 21) {
      setAgeWarning('⚠️ Customer must be 21 or older to purchase cannabis products');
    } else if (age < 18) {
      setAgeWarning('🚨 Customer must be 18 or older to enter the premises');
    } else {
      setAgeWarning('');
    }
  };

  // Handle phone number formatting
  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  // Handle tag selection
  const toggleTag = (tag: string) => {
    setCustomer(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  // Handle customer selection
  const handleSelectCustomer = (selectedCustomer: Customer) => {
    onSave(selectedCustomer);
    onClose();
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (customer.age < 21) {
      alert('Customer must be 21 or older to purchase cannabis products.');
      return;
    }
    
    if (!customer.fullName.trim()) {
      alert('Full name is required.');
      return;
    }
    
    if (!customer.idNumber.trim()) {
      alert('ID number is required.');
      return;
    }
    
    onSave(customer);
    onClose();
  };

  // Handle input changes
  const handleInputChange = (field: keyof Customer, value: string | number | string[]) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  if (!isOpen) return null;

  // Select Customer Mode
  if (mode === 'select') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content customer-select-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>👥 Select Customer</h2>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
          
          <div className="modal-body">
            {/* Search Bar */}
            <div className="search-section">
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="🔍 Search by Name / Phone / Email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="customer-search-input"
                />
              </div>
            </div>

            {/* Results */}
            <div className="results-section">
              <h3>📋 Results ({filteredCustomers.length} found)</h3>
              <div className="customer-results">
                {filteredCustomers.map(customer => (
                  <div key={customer.id} className="customer-result-card">
                    <div className="customer-result-header">
                      <div className="customer-basic-info">
                        <span className="customer-name">🧑 {customer.fullName}</span>
                        <span className="customer-details">
                          • {customer.phoneNumber} • {customer.age} y/o
                        </span>
                      </div>
                      <button 
                        className="select-customer-btn"
                        onClick={() => handleSelectCustomer(customer)}
                      >
                        Select
                      </button>
                    </div>
                    
                    <div className="customer-result-details">
                      {customer.idNumber ? (
                        <div className="id-info">
                          ID: {customer.idNumber} • Expires: {formatDate(customer.idExpiry)}
                        </div>
                      ) : (
                        <div className="id-info no-id">No ID on file</div>
                      )}
                      
                      {customer.tags.length > 0 && (
                        <div className="customer-result-tags">
                          {customer.tags.map(tag => (
                            <span key={tag} className="customer-result-tag">{tag}</span>
                          ))}
                        </div>
                      )}
                      
                      {customer.lastPurchase && (
                        <div className="last-purchase">
                          Last Purchase: {formatDate(customer.lastPurchase.date)} (${customer.lastPurchase.amount.toFixed(2)})
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredCustomers.length === 0 && searchTerm && (
                  <div className="no-results">
                    <p>No customers found matching "{searchTerm}"</p>
                    <button 
                      className="add-new-customer-btn"
                      onClick={() => {
                        setSearchTerm('');
                        // Switch to add mode
                        onClose();
                        // This would need to be handled by parent component
                      }}
                    >
                      🆕 Add New Customer
                    </button>
                  </div>
                )}
                
                {filteredCustomers.length === 0 && !searchTerm && (
                  <div className="no-results">
                    <p>No saved customers found</p>
                    <button 
                      className="add-new-customer-btn"
                      onClick={() => {
                        onClose();
                        // This would need to be handled by parent component
                      }}
                    >
                      🆕 Add First Customer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Add/Edit Customer Mode
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content customer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {mode === 'add' && '🧑‍💼 Add New Customer'}
            {mode === 'edit' && '✏️ Edit Customer'}
          </h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Personal Information */}
          <div className="form-section">
            <h3>👤 Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={customer.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="John Doe"
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  value={customer.dateOfBirth}
                  onChange={(e) => handleDateOfBirthChange(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={customer.age}
                  readOnly
                  className="form-input readonly"
                  style={{ backgroundColor: '#f5f5f5' }}
                />
                {ageWarning && (
                  <div className={`age-warning ${ageWarning.includes('⚠️') ? 'warning' : 'error'}`}>
                    {ageWarning}
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={customer.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', formatPhoneNumber(e.target.value))}
                  placeholder="(123) 456-7890"
                  maxLength={14}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@email.com"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Preferred Contact</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="sms"
                      checked={customer.preferredContact === 'sms'}
                      onChange={(e) => handleInputChange('preferredContact', e.target.value as 'sms' | 'email')}
                    />
                    <span>SMS</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="email"
                      checked={customer.preferredContact === 'email'}
                      onChange={(e) => handleInputChange('preferredContact', e.target.value as 'sms' | 'email')}
                    />
                    <span>Email</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ID Information */}
          <div className="form-section">
            <h3>🪪 ID Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>ID Type *</label>
                <select
                  value={customer.idType}
                  onChange={(e) => handleInputChange('idType', e.target.value)}
                  required
                  className="form-input"
                >
                  <option>Driver's License</option>
                  <option>State ID</option>
                  <option>Passport</option>
                  <option>Military ID</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>ID Number *</label>
                <input
                  type="text"
                  value={customer.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  placeholder="NY123456789"
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={customer.idExpiry}
                  onChange={(e) => handleInputChange('idExpiry', e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Verified By</label>
                <input
                  type="text"
                  value={customer.verifiedBy}
                  onChange={(e) => handleInputChange('verifiedBy', e.target.value)}
                  placeholder="Staff member name"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="form-section">
            <h3>🏷️ Tags</h3>
            <div className="tags-container">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-btn ${customer.tags.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="form-section">
            <h3>📝 Notes</h3>
            <div className="form-group">
              <textarea
                value={customer.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Good tipper, prefers indica strains, delivery address..."
                className="form-textarea"
                rows={3}
              />
            </div>
          </div>
        </form>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            onClick={handleSubmit}
            disabled={customer.age < 21 || !customer.fullName.trim()}
          >
            {mode === 'add' && 'Save Customer'}
            {mode === 'edit' && 'Update Customer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal; 