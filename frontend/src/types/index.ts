// Type Definitions

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'user';
  created_at: string;
}

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  cost: number;
  sku?: string;
  category?: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: number;
  customer_id: number;
  user_id: number;
  sale_date: string;
  total_amount: number;
  discount: number;
  tax: number;
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  items?: SaleItem[];
}

export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  discount: number;
  product?: Product;
}

export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  salesGrowth: number;
  revenueGrowth: number;
  recentSales: Sale[];
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}
