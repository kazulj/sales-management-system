/**
 * Customers Routes
 * CRUD operations for customer management
 */

import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/customers
 * Get all customers with optional filtering
 */
router.get('/', (req: AuthRequest, res: Response) => {
  try {
    const { search, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM customers';
    const params: any[] = [];

    if (search) {
      query += ' WHERE name LIKE ? OR email LIKE ? OR company LIKE ?';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const customers = db.prepare(query).all(...params);

    // Get total count
    const countQuery = search
      ? 'SELECT COUNT(*) as total FROM customers WHERE name LIKE ? OR email LIKE ? OR company LIKE ?'
      : 'SELECT COUNT(*) as total FROM customers';
    const countParams = search ? [`%${search}%`, `%${search}%`, `%${search}%`] : [];
    const { total } = db.prepare(countQuery).get(...countParams) as { total: number };

    res.json({ customers, total, limit: Number(limit), offset: Number(offset) });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: '顧客一覧の取得に失敗しました' });
  }
});

/**
 * GET /api/customers/:id
 * Get customer by ID
 */
router.get('/:id', (req: AuthRequest, res: Response) => {
  try {
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);

    if (!customer) {
      res.status(404).json({ error: '顧客が見つかりません' });
      return;
    }

    res.json(customer);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: '顧客情報の取得に失敗しました' });
  }
});

/**
 * POST /api/customers
 * Create new customer
 */
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('名前は必須です'),
    body('email').optional().isEmail().withMessage('有効なメールアドレスを入力してください'),
    body('phone').optional().trim(),
    body('company').optional().trim(),
    body('address').optional().trim(),
    body('city').optional().trim(),
    body('country').optional().trim(),
    body('notes').optional().trim(),
  ],
  (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { name, email, phone, company, address, city, country, notes } = req.body;

      const result = db.prepare(
        `INSERT INTO customers (name, email, phone, company, address, city, country, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(name, email || null, phone || null, company || null, address || null, city || null, country || null, notes || null);

      const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(result.lastInsertRowid);

      res.status(201).json({ message: '顧客を登録しました', customer });
    } catch (error: any) {
      console.error('Create customer error:', error);
      if (error.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: 'このメールアドレスは既に登録されています' });
      } else {
        res.status(500).json({ error: '顧客の登録に失敗しました' });
      }
    }
  }
);

/**
 * PUT /api/customers/:id
 * Update customer
 */
router.put(
  '/:id',
  [
    body('name').trim().notEmpty().withMessage('名前は必須です'),
    body('email').optional().isEmail().withMessage('有効なメールアドレスを入力してください'),
  ],
  (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { name, email, phone, company, address, city, country, notes } = req.body;

      const result = db.prepare(
        `UPDATE customers
         SET name = ?, email = ?, phone = ?, company = ?, address = ?, city = ?, country = ?, notes = ?
         WHERE id = ?`
      ).run(name, email || null, phone || null, company || null, address || null, city || null, country || null, notes || null, req.params.id);

      if (result.changes === 0) {
        res.status(404).json({ error: '顧客が見つかりません' });
        return;
      }

      const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
      res.json({ message: '顧客情報を更新しました', customer });
    } catch (error: any) {
      console.error('Update customer error:', error);
      if (error.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: 'このメールアドレスは既に使用されています' });
      } else {
        res.status(500).json({ error: '顧客情報の更新に失敗しました' });
      }
    }
  }
);

/**
 * DELETE /api/customers/:id
 * Delete customer
 */
router.delete('/:id', (req: AuthRequest, res: Response) => {
  try {
    const result = db.prepare('DELETE FROM customers WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
      res.status(404).json({ error: '顧客が見つかりません' });
      return;
    }

    res.json({ message: '顧客を削除しました' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: '顧客の削除に失敗しました' });
  }
});

export default router;
