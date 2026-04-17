const mongoose = require('mongoose');

var openningBalanceSchema = new mongoose.Schema({
    openningbalancenumber: {
        type: String,
        unique: true  // This should be unique, not amount
    },
    addedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,  // Changed from String to Number
        required: true,
        // Remove any unique: true if present
    },
    shiftstoken: {
        type: String,
    },
    shiftacess: {
        type: String,
    },
    status: {
        type: String,
        default: 'Active'
    },
    date: {
        type: Date,
        default: Date.now
    },
    closingamount: {
        type: Number,  // Changed from String to Number
        default: null
    }
});

// Create compound index to prevent duplicate amounts on the same day
// This is better than a simple unique index on amount
openningBalanceSchema.index({ date: 1, amount: 1 }, { unique: true });

// Ensure openningbalancenumber is unique
openningBalanceSchema.index({ openningbalancenumber: 1 }, { unique: true });

// Export the model
module.exports = mongoose.model('Openningbalance', openningBalanceSchema);