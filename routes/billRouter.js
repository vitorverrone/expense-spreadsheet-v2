import { Router } from 'express';
import { createBill, getBillsFromUser, getBillsFromUserWithFilters, deleteBill } from '../controllers/billController.js';

const router = Router();

// CREATE USER
router.route('/').post(createBill);

// GET BILLS FROM USER
router.route('/:id').get(getBillsFromUser);

// GET BILLS FROM USER BY MONTH
router.route('/:id/:month').get(getBillsFromUserWithFilters);

// GET BILLS FROM USER WITH FILTER
router.route('/:id/:month/:search').get(getBillsFromUserWithFilters);

// DELETE BILL
router.route('/:id').delete(deleteBill);

export default router;
