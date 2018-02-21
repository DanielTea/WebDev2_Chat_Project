const mongoose = require('mongoose');

/**
 * Mongoose Schema of a Message
 */
const messageSchema = mongoose.Schema({
    content: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedAt: Date,
    createdAt: Date
});

messageSchema.pre('save', function (next) {
    const currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
