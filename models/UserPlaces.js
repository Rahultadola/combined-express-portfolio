import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  image: {
    src: { type: String, required: true },
    alt: { type: String, required: true }
  },
  lat: { 
    type: Number, 
    required: true 
  },
  lon: { 
    type: Number, 
    required: true 
  }
});

const UserPlace = mongoose.model('UserPlace', placeSchema);

export default UserPlace;
