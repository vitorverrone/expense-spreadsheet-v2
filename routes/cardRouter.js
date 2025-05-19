import { Router } from 'express';
import { createCard, getCardsFromUser, deleteCard } from '../controllers/cardController.js';

const router = Router();

// CREATE USER
router.route('/').post(createCard);

// GET BILLS FROM USER
router.route('/:id').get(getCardsFromUser);

// DELETE BILL
router.route('/:id').delete(deleteCard);

export default router;
