import express from 'express';
import bodyParser from 'body-parser';

import foodOrderRoutes from './routes/food-order.js';
import opinionRoutes from './routes/opinions.js';
import placePickerRoutes from './routes/place-picker.js';
import tanstackEventRoutes from './routes/tanstack-events.js';
import routerEventRoutes from './routes/router-events.js';


import mongoose from 'mongoose';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;
const mongoDBURL = process.env.MONGODB_URL;


const app = express();


mongoose.connect(mongoDBURL).then(() => {
  console.log("Connection Successful");
  app.listen(PORT)
}).catch(err => console.error("DB Connection error: ", err))


app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('images'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});




app.use('/food-order', foodOrderRoutes)
app.use('/opinions', opinionRoutes)
app.use('/place-picker', placePickerRoutes)
app.use('/tanstack-events', tanstackEventRoutes)
app.use('/router-events', routerEventRoutes)




app.use((req, res) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: '404 - Not found' });
});


// app.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });
