import mongoose from 'mongoose'

// 1. Schema for individual food items
const itemSchema = new mongoose.Schema({
  id: String, // Maps to your "m1", "m2" strings
  price: Number, // Use Number if you plan to do math later
  name: String,
  quantity: Number
});

// 2. Main Order Schema
const orderSchema = new mongoose.Schema({
  items: {
    items: [itemSchema] // Nested array of items
  },
  customer: {
    name: String,
    email: String,
    street: String,
    'postal-code': String, // Hyphenated keys require quotes
    city: String
  },
  id: { type: String, required: true } // Your custom string ID
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
