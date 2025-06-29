import React from 'react';
import './Inventory.css';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  status: 'healthy' | 'low' | 'out';
}

const Inventory: React.FC = () => {
  const inventoryData: InventoryItem[] = [
    { id: '1', name: 'Blue Dream Joint', category: 'Pre-Rolls', stock: 32, unit: 'units', status: 'healthy' },
    { id: '2', name: 'OG Kush Cartridge', category: 'Cartridges', stock: 8, unit: 'units', status: 'low' },
    { id: '3', name: 'Gelato Flower', category: 'Flower', stock: 15, unit: 'oz', status: 'healthy' },
    { id: '4', name: 'Chocolate Brownie', category: 'Edibles', stock: 25, unit: 'units', status: 'healthy' },
    { id: '5', name: 'Sour Diesel Mini', category: 'Pre-Rolls', stock: 12, unit: 'units', status: 'low' },
    { id: '6', name: 'CBD Tincture', category: 'Tinctures', stock: 0, unit: 'bottles', status: 'out' },
    { id: '7', name: 'Lemon Haze', category: 'Flower', stock: 22, unit: 'oz', status: 'healthy' },
    { id: '8', name: 'Gummy Bears', category: 'Edibles', stock: 18, unit: 'packs', status: 'healthy' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return '#28a745';
      case 'low':
        return '#ffc107';
      case 'out':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return '✅ Healthy';
      case 'low':
        return '⚠️ Low Stock';
      case 'out':
        return '❌ Out of Stock';
      default:
        return '❓ Unknown';
    }
  };

  return (
    <div className="inventory-component">
      <div className="inventory-header">
        <h2>📦 Inventory Snapshot</h2>
        <div className="inventory-summary">
          Total: {inventoryData.length} products
        </div>
      </div>
      
      <div className="inventory-grid">
        {inventoryData.map(item => (
          <div key={item.id} className="inventory-item">
            <div className="inventory-category">
              <span className="category-emoji">🌿</span>
              <span className="category-name">{item.name}</span>
            </div>
            <div className="inventory-details">
              <div className="detail-row">
                <span className="detail-label">• {item.category}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">• {item.stock} {item.unit}</span>
              </div>
              <div className="detail-row stock-row">
                <span 
                  className="stock-status"
                  style={{ 
                    color: getStatusColor(item.status),
                    fontWeight: '500'
                  }}
                >
                  {getStatusText(item.status)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory; 