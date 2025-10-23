/**
 * Products Routes
 * CRUD operations for product management
 */

import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

/**
 * GET /api/products
 * Get all products
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json({ products: result.rows, total: result.rows.length });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

/**
 * GET /api/products/:id
 * Get single product
 */
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to get product' });
  }
});

/**
 * POST /api/products
 * Create new product
 */
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, cost, sku, category, stock_quantity, is_active } = req.body;

    const result = await pool.query(
      'INSERT INTO products (name, description, price, cost, sku, category, stock_quantity, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, description || null, price, cost, sku || null, category || null, stock_quantity || 0, is_active !== false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

/**
 * PUT /api/products/:id
 * Update product
 */
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, cost, sku, category, stock_quantity, is_active } = req.body;

    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, cost = $4, sku = $5, category = $6, stock_quantity = $7, is_active = $8 WHERE id = $9 RETURNING *',
      [name, description, price, cost, sku, category, stock_quantity, is_active, req.params.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

/**
 * DELETE /api/products/:id
 * Delete product
 */
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
