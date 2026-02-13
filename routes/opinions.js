import fs from 'node:fs/promises';
import express from 'express';

import Opinion  from '../models/Opinions.js'


const router = express.Router();
// const dbPath = './data/opinions.json';



async function loadOpinions() {
  const opinions = await Opinion.find();
  return opinions
}

async function saveOpinion(opinion) {
  const newOpinion = new Opinion({ id: new Date().getTime(), votes: 0, ...opinion })
  const savedOpinion = await newOpinion.save();
  return savedOpinion;
}

async function upvoteOpinion(id) {
  const updatedOpinion = await Opinion.findOneAndUpdate(
    { "id": id },
    { $inc: { "votes": 1} },
    { returnDocument: 'after'}
  );

  if (!updatedOpinion) return null;

  return updatedOpinion;
}

async function downvoteOpinion(id) {
  const updatedOpinion = await Opinion.findOneAndUpdate(
    { "id": id },
    { $inc: { "votes": -1} },
    { returnDocument: 'after'}
  );

  if (!updatedOpinion) return null;

  return updatedOpinion;
}



router.get('/', async (req, res) => {
  try {
    const opinions = await loadOpinions();
    res.json(opinions);
  } catch (error) {
    res.status(500).json({ error: 'Error loading opinions.' });
  }
});

router.post('/', async (req, res) => {
  const { userName, title, body } = req.body;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!userName || !title || !body) {
    return res
      .status(400)
      .json({ error: 'User name, title and opinion body are required.' });
  }
  try {
    const newOpinion = await saveOpinion({ userName, title, body });
    res.status(201).json(newOpinion);
  } catch (error) {
    res.status(500).json({ error: 'Error saving opinion.' });
  }
});

router.post('/:id/upvote', async (req, res) => {
  const { id } = req.params;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const opinion = await upvoteOpinion(Number(id));
    if (!opinion) {
      return res.status(404).json({ error: 'Opinion not found.' });
    }
    res.json(opinion);
  } catch (error) {
    res.status(500).json({ error: 'Error upvoting opinion.' });
  }
});

router.post('/:id/downvote', async (req, res) => {
  const { id } = req.params;
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const opinion = await downvoteOpinion(Number(id));
    if (!opinion) {
      return res.status(404).json({ error: 'Opinion not found.' });
    }
    res.json(opinion);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error downvoting opinion.' });
  }
});


export default router;