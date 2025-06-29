import React from 'react';
import Navigation from '../../components/Navigation';
import Inventory from '../../components/Inventory';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <Navigation currentPage="home" />
      <div className="dashboard-content">
        <div className="welcome-section">
          <div className="welcome-message">Welcome to Buffalo Garden!</div>
          <div className="today-date">📅 Today: {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</div>
        </div>
        
        <div className="dashboard-grid">
          <div className="dashboard-card sales-card">
            <div className="card-title">🛒 Today's Sales</div>
            <div className="card-value">$2,847</div>
            <div className="card-sub">47 transactions</div>
          </div>
          
          <div className="dashboard-card">
            <div className="card-title">🚨 Alerts</div>
            <div className="card-alert">⚠️ Low stock: Blue Dream Joint (5 remaining)</div>
            <div className="card-alert">ℹ️ License expires in 45 days</div>
            <div className="card-alert">✅ Daily compliance report sent</div>
          </div>
          
          <div className="dashboard-card quick-actions">
            <div className="card-title">🔍 Quick Actions</div>
            <div className="actions-list">
              <button className="action-btn">+ Add Product</button>
              <button className="action-btn">Record Sale</button>
              <button className="action-btn">Print Report</button>
            </div>
          </div>
        </div>
        
        <div className="inventory-snapshot">
          <Inventory />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 