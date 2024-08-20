const mongoose = require('mongoose')

const MigraineEventSchema = new mongoose.Schema({
  attackType: {
    type: String,
    enum: ['headache', 'migraine', 'misc symptoms'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  duration: {
    type: Number,
    required: false
  },
  painLevel: {
    type: Number,
    enum: [0, 1, 2, 3, 4],
    required: false
  },
  painLocation: {
    type: [String],
    enum: ['left', 'right', 'front', 'back', 'entire head'],
    required: false
  },
  notes: {
    type: String,
    required: false
  },
  medication: {
    type: Boolean,
    required: false
  },
  medications: [{
    name: String,
    dose: String,
    quantity: Number
  }],
  triggers: {
    type: [String],
    required: false
  },
  userId: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('MigraineEvent', MigraineEventSchema)