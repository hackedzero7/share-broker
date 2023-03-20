const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  stock: {
    type: mongoose.Schema.ObjectId,
    ref: 'Stock',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Selling', schema);
