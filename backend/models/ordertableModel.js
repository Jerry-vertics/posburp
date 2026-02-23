const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ordertableSchema = new mongoose.Schema({
    ordertableId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table'

    },
    ordernumber:{
        type:String,
    },
    numberofperson:{type:String},
    orderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pos'
    },
    orderstatus:{type:String},

    date: { type: Date, default: Date.now },


});

//Export the model
module.exports = mongoose.model('Ordertable', ordertableSchema);