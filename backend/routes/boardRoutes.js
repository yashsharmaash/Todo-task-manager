import express from 'express';
import { body, validationResult } from 'express-validator';
import {
    getBoards,
    createBoard,
    updateBoard,
    deleteBoard,
} from '../controllers/boardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation middleware
const validateBoard = [
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required')
        .trim()
        .isLength({ max: 50 })
        .withMessage('Title cannot exceed 50 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

router.use(protect);

router.route('/')
    .get(getBoards)
    .post(validateBoard, createBoard);

router.route('/:id')
    .put(validateBoard, updateBoard)
    .delete(deleteBoard);

export default router;
