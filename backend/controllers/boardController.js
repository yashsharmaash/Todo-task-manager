import asyncHandler from 'express-async-handler';
import Board from '../models/Board.js';
import Todo from '../models/Todo.js';

// @desc    Get all boards for user
// @route   GET /api/boards
// @access  Private
const getBoards = asyncHandler(async (req, res) => {
    const boards = await Board.find({ user: req.user._id });
    res.json(boards);
});

// @desc    Create a board
// @route   POST /api/boards
// @access  Private
const createBoard = asyncHandler(async (req, res) => {
    const { title } = req.body;

    const board = await Board.create({
        user: req.user._id,
        title,
    });

    res.status(201).json(board);
});

// @desc    Update a board
// @route   PUT /api/boards/:id
// @access  Private
const updateBoard = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const board = await Board.findById(req.params.id);

    if (!board) {
        res.status(404);
        throw new Error('Board not found');
    }

    // Check ownership
    if (board.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized');
    }

    board.title = title || board.title;
    const updatedBoard = await board.save();
    res.json(updatedBoard);
});

// @desc    Delete board and associated todos
// @route   DELETE /api/boards/:id
// @access  Private
const deleteBoard = asyncHandler(async (req, res) => {
    const board = await Board.findById(req.params.id);

    if (!board) {
        res.status(404);
        throw new Error('Board not found');
    }

    // Check ownership
    if (board.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized');
    }

    // Manually delete associated todos (Cascade Delete)
    await Todo.deleteMany({ boardId: board._id });

    // Delete the board
    await Board.deleteOne({ _id: board._id });

    res.json({ message: 'Board removed' });
});

export { getBoards, createBoard, updateBoard, deleteBoard };
