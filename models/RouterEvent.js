import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Invalid title.'],
    trim: true // Removes extra whitespace
  },
  description: {
    type: String,
    required: [true, 'Invalid description.']
  },
  date: {
    type: Date,
    required: [true, 'Invalid date.']
  },
  image: {
    type: String,
    required: [true, 'Invalid image.'],
    validate: {
      validator: function(v) {
        // 1. Check if it's a valid URL format
        // 2. Optional: check for image extensions (jpg, png, etc.)
        const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|avif))$/i;
        return urlRegex.test(v);
      },
      message: 'Invalid image URL. Must be a valid link ending in an image extension.'
    }
  }
});

const RouterEvent = mongoose.model('RouterEvent', eventSchema);

export default RouterEvent;
