const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const walletSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true
  },
  balance: {
    type: Number,
    default: 2000
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
