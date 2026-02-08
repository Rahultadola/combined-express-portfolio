import fs from 'node:fs/promises';
import express from 'express';

const router = express.Router();


router.get('/places', async (req, res) => {
  const fileContent = await fs.readFile('./data/places.json');
  const placesData = JSON.parse(fileContent);
  res.status(200).json({ places: placesData });
});


router.get('/user-places', async (req, res) => {
  const fileContent = await fs.readFile('./data/user-places.json');
  const places = JSON.parse(fileContent);
  res.status(200).json({ places });
});


router.put('/user-places', async (req, res) => {
  const places = req.body.places;
  await fs.writeFile('./data/user-places.json', JSON.stringify(places));
  res.status(200).json({ message: 'User places updated!' });
});

export default router;