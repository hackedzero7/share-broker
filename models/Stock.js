const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    image:{
        public_id:{
            type: String,
            required: true,
        },
        url: {
            type:String,
            required: true
        }
    },
    ticker:{
        type:String,
        required: true
    },
    noOfShares:{
        type: Number,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
      }
})

module.exports = mongoose.model("Stock", schema);