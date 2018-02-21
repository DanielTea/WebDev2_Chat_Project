const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Mongoose Schema of a User
 */
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: String,
    birthDate: Date,
    email: {
        type: String,
        required: true,
        unique: true
    },
    status: String,
    password: String,
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    pictureUrl: String,
    updatedAt: Date,
    createdAt: Date
});

userSchema.pre('save', (next) => {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
});

/**
 * Hash passwords with bcrypt
 * @param password clear-text password
 * @return {string|string} bcrypt-hashed password
 */
userSchema.statics.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

/**
 * Compare saved bcrypt hash against the hashed password param
 * @param password clear-text password input
 * @return {boolean} true if the hashes match
 */
userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
