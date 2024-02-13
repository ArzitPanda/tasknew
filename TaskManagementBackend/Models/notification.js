const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message: String,
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to User model
});



notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });
const Notification = mongoose.model('Notification', notificationSchema);




module.exports = Notification;