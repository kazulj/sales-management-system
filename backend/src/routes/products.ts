/**
 * Products Routes
 * CRUD operations for product management
 */

import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

/**
 * GET /api/products
 * Get all products
 */
router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const { search, category, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (search) {
      query += ' AND (name LIKE ? OR sku LIKE ? OR description LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const products = db.prepare(query).all(...params);

    const countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1' +
      (search ? ' AND (name LIKE ? OR sku LIKE ? OR description LIKE ?)' : '') +
      (category ? ' AND category = ?' : '');
    const countParams = [];
    if (search) countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    if (category) countParams.push(category);
    const { total } = db.prepare(countQuery).get(...countParams) as { total: number };

    res.json({ products, total, limit: Number(limit), offset: Number(offset) });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: '商品一覧の取得に失敗しました' });
  }
});

/**
 * GET /api/products/:id
 * Get product by ID
 */
router.get('/:id', (req: AuthRequest, res: Response) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);

    if (!product) {
      res.status(404).json({ error: '商品が見つかりません' });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: '商品情報の取得に失敗しました' });
  }
});

/**
 * POST /api/products
 * Create new product
 */
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('商品名は必須です'),
    body('price').isFloat({ min: 0 }).withMessage('価格は0以上の数値である必要があります'),
    body('cost').isFloat({ min: 0 }).withMessage('原価は0以上の数値である必要があります'),
    body('stock_quantity').isInt({ min: 0 }).withMessage('在庫数は0以上の整数である必要があります'),
  ],
  (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { name, description, price, cost, sku, category, stock_quantity, is_active = true } = req.body;

      const result = db.prepare(
        `INSERT INTO products (name, description, price, cost, sku, category, stock_quantity, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(name, description || null, price, cost, sku || null, category || null, stock_quantity, is_active ? 1 : 0);

      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);

      res.status(201).json({ message: '商品を登録しました', product });
    } catch (error: any) {
      console.error('Create product error:', error);
      if (error.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: 'このSKUは既に登録されています' });
      } else {
        res.status(500).json({ error: '商品の登録に失敗しました' });
      }
    }
  }
);

/**
 * PUT /api/products/:id
 * Update product
 */
router.put(
  '/:id',
  [
    body('name').trim().notEmpty().withMessage('商品名は必須です'),
    body('price').isFloat({ min: 0 }).withMessage('価格は0以上の数値である必要があります'),
    body('cost').isFloat({ min: 0 }).withMessage('原価は0以上の数値である必要があります'),
  ],
  (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { name, description, price, cost, sku, category, stock_quantity, is_active } = req.body;

      const result = db.prepare(
        `UPDATE products
         SET name = ?, description = ?, price = ?, cost = ?, sku = ?, category = ?, stock_quantity = ?, is_active = ?
         WHERE id = ?`
      ).run(name, description || null, price, cost, sku || null, category || null, stock_quantity, is_active ? 1 : 0, req.params.id);

      if (result.changes === 0) {
        res.status(404).json({ error: '商品が見つかりません' });
        return;
      }

      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
      res.json({ message: '商品情報を更新しました', product });
    } catch (error: any) {
      console.error('Update product error:', error);
      if (error.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: 'このSKUは既に使用されています' });
      } else {
        res.status(500).json({ error: '商品情報の更新に失敗しました' });
      }
    }
  }
);

/**
 * DELETE /api/products/:id
 * Delete product
 */
router.delete('/:id', (req: AuthRequest, res: Response) => {
  try {
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
      res.status(404).json({ error: '商品が見つかりません' });
      return;
    }

    res.json({ message: '商品を削除しました' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: '商品の削除に失敗しました' });
  }
});

export default router;
