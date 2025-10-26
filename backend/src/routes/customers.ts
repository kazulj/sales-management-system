/**
 * Customers Routes
 * CRUD operations for customer management
 */

import { Router, Response } from 'express';

import pool from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

/**
 * GET /api/customers
 * Get all customers
 */
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
    res.json({ customers: result.rows, total: result.rows.length });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Failed to get customers' });
  }
});

/**
 * GET /api/customers/:id
 * Get single customer
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Failed to get customer' });
  }
});

/**
 * POST /api/customers
 * Create new customer
 */
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, company, address, city, country, notes } = req.body;

    const result = await pool.query(
      'INSERT INTO customers (name, email, phone, company, address, city, country, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, email || null, phone || null, company || null, address || null, city || null, country || null, notes || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

/**
 * PUT /api/customers/:id
 * Update customer
 */
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, company, address, city, country, notes } = req.body;

    const result = await pool.query(
      'UPDATE customers SET name = $1, email = $2, phone = $3, company = $4, address = $5, city = $6, country = $7, notes = $8 WHERE id = $9 RETURNING *',
      [name, email, phone, company, address, city, country, notes, req.params.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

/**
 * DELETE /api/customers/:id
 * Delete customer
 */
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING id', [req.params.id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export default router;

