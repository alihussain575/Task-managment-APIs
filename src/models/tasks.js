const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Number,
    trim: true,
    default: Date.now(),
  },
  owner : {
    type : mongoose.Schema.Types.ObjectId,
    require : true, 
    ref : 'User',
  }
});

module.exports = Task;
