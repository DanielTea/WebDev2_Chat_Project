var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: String,
    birthDate: Date,
    email: {
        type: String,
        required: true
    },
    status: String,
    password: String,
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    picture: {
        data: Buffer,
        contentType: String
    },
    updatedAt: Date,
    createdAt: Date
});

userSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
});

var User = mongoose.model('User', userSchema);
module.exports = User;
