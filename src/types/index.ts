// Product Types
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  thc: string;
  cbd: string;
  image: string;
  description: string;
  batchId?: string;
  weight?: string;
}

// Customer Types
export interface Customer {
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

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Sale Types
export interface Sale {
  id: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'CASH' | 'CARD' | 'CASHAPP';
  timestamp: Date;
  cashierId: string;
  complianceData: {
    batchNumbers: string[];
    weights: string[];
    dosages: string[];
  };
}

// Inventory Types
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  status: 'healthy' | 'low' | 'out';
}

// Settings Types
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Cashier' | 'Inventory Manager' | 'Compliance Officer';
  status: 'Active' | 'Inactive';
  lastLogin?: string;
  createdAt: string;
}

export interface StoreInfo {
  storeName: string;
  licenseNumber: string;
  address: string;
  phone: string;
  email: string;
  operatingHours: string;
  logo?: string;
  footerNote: string;
}

export interface ComplianceSettings {
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

export interface POSSettings {
  defaultPaymentMethod: 'CARD' | 'CASH';
  receiptFormat: 'Printed' | 'Email' | 'Both';
  tipPrompt: boolean;
  taxes: boolean;
  roundPrices: '0.10' | '0.01' | 'none';
  discountPresets: string[];
}

export interface Integration {
  name: string;
  status: 'Connected' | 'Not Connected' | 'Error';
  lastSync?: string;
  apiKey?: string;
}

export interface SecuritySettings {
  passwordPolicy: 'Strong' | 'Medium' | 'Weak';
  twoFactorAuth: boolean;
  failedLoginLockout: {
    enabled: boolean;
    attempts: number;
    duration: number;
  };
  sessionTimeout: number;
}

// Navigation Types
export type NavigationPage = 'home' | 'inventory' | 'sales' | 'settings';

// Modal Types
export type CustomerModalMode = 'add' | 'edit' | 'select'; 