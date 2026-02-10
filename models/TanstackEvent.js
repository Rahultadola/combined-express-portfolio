import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true // Ensures "e1" cannot be duplicated
  },
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  date: { 
    type: String,
    required: true 
  },
  time: { 
    type: String,
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String,
    required: true 
  }
}, { 
  timestamps: true
});

const TanstackEvent = mongoose.model('TanstackEvent', eventSchema);

export default TanstackEvent;
