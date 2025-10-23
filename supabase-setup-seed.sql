-- ============================================
-- Seed Data for Development
-- PostgreSQL Version for Supabase
-- ============================================

-- Admin User (password: admin123)
INSERT INTO users (id, email, password, full_name, role) VALUES
(1, 'admin@sales.com', '$2a$10$zOm.08MvEKJQj6R5jHHjAupE98kQIThUbKnl3jtXrLEhU7wlPZMPS', 'Admin User', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence for users
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Sample Customers
INSERT INTO customers (name, email, phone, company, address, city, country) VALUES
('John Doe', 'john@example.com', '+1-555-0101', 'ABC Corp', '123 Main St', 'New York', 'USA'),
('Jane Smith', 'jane@example.com', '+1-555-0102', 'XYZ Inc', '456 Oak Ave', 'Los Angeles', 'USA'),
('Bob Johnson', 'bob@example.com', '+1-555-0103', 'Tech Solutions', '789 Pine Rd', 'Chicago', 'USA'),
('Alice Williams', 'alice@example.com', '+1-555-0104', 'Digital Agency', '321 Elm St', 'Houston', 'USA'),
('Charlie Brown', 'charlie@example.com', '+1-555-0105', 'Brown Enterprises', '654 Maple Dr', 'Phoenix', 'USA')
ON CONFLICT (email) DO NOTHING;

-- Sample Products
INSERT INTO products (name, description, price, cost, sku, category, stock_quantity) VALUES
('Premium Laptop', 'High-performance laptop for professionals', 1299.99, 800.00, 'LAP-001', 'Electronics', 50),
('Wireless Mouse', 'Ergonomic wireless mouse', 29.99, 15.00, 'MOU-001', 'Electronics', 200),
('USB-C Hub', 'Multi-port USB-C hub', 49.99, 25.00, 'HUB-001', 'Accessories', 150),
('Mechanical Keyboard', 'RGB mechanical gaming keyboard', 89.99, 45.00, 'KEY-001', 'Electronics', 75),
('Monitor Stand', 'Adjustable monitor stand', 39.99, 20.00, 'STA-001', 'Accessories', 100),
('Webcam HD', '1080p HD webcam', 69.99, 35.00, 'CAM-001', 'Electronics', 80),
('Laptop Bag', 'Professional laptop carrying bag', 44.99, 22.00, 'BAG-001', 'Accessories', 120),
('External SSD', '1TB External SSD', 119.99, 60.00, 'SSD-001', 'Storage', 60),
('Wireless Headphones', 'Noise-cancelling headphones', 199.99, 100.00, 'HEA-001', 'Electronics', 40),
('Phone Stand', 'Adjustable phone stand', 19.99, 10.00, 'STA-002', 'Accessories', 180)
ON CONFLICT (sku) DO NOTHING;

-- Sample Sales (Recent months)
INSERT INTO sales (customer_id, user_id, sale_date, total_amount, discount, tax, status, payment_method) VALUES
(1, 1, '2024-01-15', 1329.98, 0, 106.40, 'completed', 'Credit Card'),
(2, 1, '2024-01-18', 159.97, 10.00, 11.20, 'completed', 'PayPal'),
(3, 1, '2024-01-22', 89.99, 0, 7.20, 'completed', 'Credit Card'),
(4, 1, '2024-02-05', 289.96, 20.00, 21.60, 'completed', 'Debit Card'),
(5, 1, '2024-02-10', 119.99, 0, 9.60, 'completed', 'Cash'),
(1, 1, '2024-02-14', 69.99, 5.00, 5.00, 'completed', 'Credit Card'),
(2, 1, '2024-02-20', 199.99, 0, 16.00, 'completed', 'PayPal'),
(3, 1, '2024-03-01', 1469.95, 50.00, 113.60, 'completed', 'Credit Card'),
(4, 1, '2024-03-05', 99.98, 0, 8.00, 'completed', 'Debit Card'),
(5, 1, '2024-03-12', 44.99, 0, 3.60, 'completed', 'Cash'),
(1, 1, '2024-03-15', 229.97, 10.00, 17.60, 'completed', 'Credit Card'),
(2, 1, '2024-03-20', 139.98, 0, 11.20, 'completed', 'PayPal')
ON CONFLICT DO NOTHING;

-- Sample Sale Items
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES
(1, 1, 1, 1299.99, 1299.99),
(1, 2, 1, 29.99, 29.99),
(2, 3, 1, 49.99, 49.99),
(2, 4, 1, 89.99, 89.99),
(2, 5, 1, 39.99, 39.99),
(3, 4, 1, 89.99, 89.99),
(4, 1, 1, 1299.99, 1299.99),
(4, 6, 1, 69.99, 69.99),
(4, 7, 1, 44.99, 44.99),
(5, 8, 1, 119.99, 119.99),
(6, 6, 1, 69.99, 69.99),
(7, 9, 1, 199.99, 199.99),
(8, 1, 1, 1299.99, 1299.99),
(8, 2, 2, 29.99, 59.98),
(8, 3, 1, 49.99, 49.99),
(8, 10, 3, 19.99, 59.99),
(9, 5, 1, 39.99, 39.99),
(9, 10, 3, 19.99, 59.99),
(10, 7, 1, 44.99, 44.99),
(11, 9, 1, 199.99, 199.99),
(11, 2, 1, 29.99, 29.99),
(12, 6, 2, 69.99, 139.98)
ON CONFLICT DO NOTHING;
