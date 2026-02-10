import fs from 'node:fs/promises';
import express from 'express';

import UserPlaces from '../models/UserPlaces.js';

const router = express.Router();


router.get('/places', async (req, res) => {
  const fileContent = await fs.readFile('./data/places.json');
  const placesData = JSON.parse(fileContent);
  res.status(200).json({ places: placesData });
});


router.get('/user-places', async (req, res) => {
  // const fileContent = await fs.readFile('./data/user-places.json');
  // const places = JSON.parse(fileContent);

  const up = await UserPlaces.find();
  res.status(200).json({ up });
});


router.put('/user-places', async (req, res) => {
  // const places = req.body.places;
  // await fs.writeFile('./data/user-places.json', JSON.stringify(places));
  // res.status(200).json({ message: 'User places updated!' });


  try {
    const placesArr = req.body.places;

    const operations = placesArr.map((place) => ({
      updateOne: {
        filter: { id: place.id },
        update: { $set: place },
        upsert: true
      }
    }));

    const result = await UserPlaces.bulkWrite(operations);

    res.status(200).json({
      message: 'User places updated!',
      upsertedCount: result.upsertedCount,
      modifiedCount: result.modifiedCount
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;