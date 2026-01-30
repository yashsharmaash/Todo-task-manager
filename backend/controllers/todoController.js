import asyncHandler from 'express-async-handler';
import Todo from '../models/Todo.js';
import Board from '../models/Board.js';

// @desc    Get todos for a specific board
// @route   GET /api/todos/:boardId
// @access  Private
const getTodos = asyncHandler(async (req, res) => {
    const { boardId } = req.params;

    // Check if board exists
    const board = await Board.findById(boardId);
    if (!board) {
        res.status(404);
        throw new Error('Board not found');
    }

    // Check ownership
    if (board.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized to access this board');
    }

    const todos = await Todo.find({ boardId });
    res.json(todos);
});

// @desc    Create a todo associated with a board
// @route   POST /api/todos
// @access  Private
const createTodo = asyncHandler(async (req, res) => {
    const { title, description, status, boardId } = req.body;

    // Verify board ownership first
    const board = await Board.findById(boardId);
    if (!board) {
        res.status(404);
        throw new Error('Board not found');
    }

    if (board.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized to create tasks on this board');
    }

    const todo = await Todo.create({
        title,
        description,
        status,
        boardId,
    });

    res.status(201).json(todo);
});

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = asyncHandler(async (req, res) => {
    const { title, description, status } = req.body;
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        res.status(404);
        throw new Error('Todo not found');
    }

    // Verify board ownership (via todo's boardId)
    const board = await Board.findById(todo.boardId);
    if (!board || board.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized');
    }

    todo.title = title || todo.title;
    todo.description = description !== undefined ? description : todo.description;
    todo.status = status || todo.status;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
});

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = asyncHandler(async (req, res) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        res.status(404);
        throw new Error('Todo not found');
    }

    // Verify ownership
    const board = await Board.findById(todo.boardId);
    if (!board || board.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await Todo.deleteOne({ _id: todo._id });

    res.json({ message: 'Todo removed' });
});

export { getTodos, createTodo, updateTodo, deleteTodo };
