const mongoose = require('mongoose');

/**
 * Mongoose Schema of a Tag
 */
const tagSchema = mongoose.Schema({
    name: String,
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    description: String,
    patternClass: {
        type: String,
        enum: ['food', 'tech', 'jigsaw', 'anchors', 'diamonds', 'cogs', 'math', 'game', 'music'],
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedAt: Date,
    createdAt: Date
});

tagSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
});

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
