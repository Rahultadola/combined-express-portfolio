import mongoose from 'mongoose'

const opinionSchema = new mongoose.Schema({
  id: Number,
  votes: Number,
  userName: String,
  title: String,
  body: String
});


const Opinion = mongoose.model('Opinion', opinionSchema);

export default Opinion;
