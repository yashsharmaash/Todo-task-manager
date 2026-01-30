import express from 'express';
import { body, validationResult } from 'express-validator';
import {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
} from '../controllers/todoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation middleware
const validateTodo = [
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required')
        .trim()
        .isLength({ max: 100 })
        .withMessage('Title cannot exceed 100 characters'),
    body('boardId')
        .not()
        .isEmpty()
        .withMessage('Board ID is required'),
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
    .post(validateTodo, createTodo);

router.route('/:boardId') // Note: Using :boardId for getting list
    .get(getTodos);

router.route('/id/:id') // Using /id/:id for specific todo operations to avoid conflict/ambiguity if needed, or simply /:id if structures allow
    .put(updateTodo) // Validation is optional for update as partial updates are allowed, but good to add if strict
    .delete(deleteTodo);

// Clarification on routes:
// POST /api/todos -> Create
// GET /api/todos/:boardId -> List by board
// PUT /api/todos/id/:id -> Update
// DELETE /api/todos/id/:id -> Delete

export default router;
