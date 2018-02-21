const mongoose = require('mongoose');

/**
 * Mongoose Schema of a Chat
 */
const chatSchema = mongoose.Schema({
    name: String,
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    updatedAt: Date,
    createdAt: Date
});

chatSchema.pre('save', function (next) {
    const currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
