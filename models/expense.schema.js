const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, ' category is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    category: {
      type: String,
      required: [true, ' category is required'],
      trim: true,
    },
    remark: {
      type: String,
      required: [true, 'remark is required'],
      trim: true,
    },
    paymentmode: {
      type: String,
      required: [true, 'payment mode is required'],
      enum: ['Cash', 'UPI', 'Cheque', 'Card'],
    },
  },
  { timestamps: true }
);

// amount, category, remark, payment-mode

module.exports = mongoose.model('expense', expenseSchema);
