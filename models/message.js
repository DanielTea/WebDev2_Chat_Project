var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    content: String,
    multimedia: {
        data: Buffer,
        contentType: String
    },
    updatedAt: Date,
    createdAt: Date
});

messageSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
});

var Message = mongoose.model('Message', messageSchema);
module.exports = Message;
