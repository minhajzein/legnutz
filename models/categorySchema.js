const { Schema } = require('mongoose');
const mongoose = require('mongoose');
const schema = mongoose.Schema;

const categorySchema = new schema({
  category : {
        type: String,
        required: true,
        trim: true
      }
},{ timestamps: true });

module.exports = mongoose.model('category',categorySchema);