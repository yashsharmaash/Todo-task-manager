import mongoose from 'mongoose';

const boardSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a board title'],
        trim: true,
        maxlength: [50, 'Title cannot be more than 50 characters']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Cascade delete todos when a board is deleted
boardSchema.pre('remove', async function (next) {
    await mongoose.model('Todo').deleteMany({ boardId: this._id });
    next();
});

const Board = mongoose.model('Board', boardSchema);

export default Board;
