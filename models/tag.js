var mongoose = require('mongoose');

var tagSchema = mongoose.Schema({
    name: String,
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    updatedAt: Date,
    createdAt: Date
});

tagSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
});

var Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
