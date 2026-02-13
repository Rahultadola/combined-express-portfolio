import fs from 'node:fs/promises';
import express from 'express';
import TanstackEvent from '../models/TanstackEvent.js';


const router = express.Router();


router.get('/events', async (req, res) => {
  const { max, search } = req.query;

  // try {
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i'); // 'i' for case-insensitive
      query = {
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { location: searchRegex }
        ]
      };
    }

    let mongoQuery = TanstackEvent.find(query).select('id title image date location');

    if (max) {
      mongoQuery = mongoQuery.sort({ _id: -1 }).limit(parseInt(max));
    }

    const events = await mongoQuery;

    res.json({ events });
  // } catch (err) {
  //   res.status(500).json({ error: "Failed to fetch events" });
  // }
});



router.get('/events/images', async (req, res) => {
  const imagesFileContent = await fs.readFile('./data/tanstack-images.json');
  const images = JSON.parse(imagesFileContent);
  res.json({ images });
});



router.get('/events/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const event = await TanstackEvent.findOne({ id: id }).lean();

    if (!event) {
      return res
        .status(404)
        .json({ message: `For the id ${id}, no event could be found.` });
    }

    res.json({ event });

  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});




router.post('/events', async (req, res) => {
  const { event } = req.body;

  if (!event) {
    return res.status(400).json({ message: 'Event is required' });
  }

  let error = false;
  let errMessage = 'Invalid data provided.';

  // console.log(event);

  if (!event.title?.trim()) {
    console.log("Title error", event.title)
    error = true
    errMessage = "Title error"
  } 

  if (!event.description?.trim()){
    console.log("description error", event.description)
    error = true
    errMessage = "Description error"
  } 
  if (!event.date?.trim()) {
    console.log("Date error", event.date)
    error = true
    errMessage = "Date error"
  }
    
  if (!event.time?.trim()) {
    console.log("Time error", event.time)
    error = true
    errMessage = "Time error"
  }
    
  if (!event.image?.trim()) {
    console.log("Image error", event.image)
    error = true
    errMessage = "Image not selected error"
  }
  if (!event.location?.trim()) {
    console.log("Location error", event.location)
    error = true
    errMessage = "Location error"
  }

  if (error){
    return res.status(400).json({ message:  errMessage});
  }

  try {
    const newEvent = new TanstackEvent({
      id: Math.round(Math.random() * 10000).toString(),
      ...eventData,
    });

    await newEvent.save();
    res.status(201).json({ event: newEvent });
    
  } catch (err) {
    res.status(400).json({ 
      message: "Could not create event.", 
      error: err.message 
    });
  }


});


router.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const { event } = req.body;

  if (!event) {
    return res.status(400).json({ message: 'Event is required' });
  }

  try {
    const updatedEvent = await TanstackEvent.findOneAndUpdate(
      { id: id }, 
      { $set: event }, 
      { 
        new: true,           // Return the document AFTER update
        runValidators: true  // Triggers your Schema's 'required' and 'trim' rules
      }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event: updatedEvent });

  } catch (err) {
    res.status(400).json({ 
      message: 'Invalid data provided.', 
      error: err.message 
    });
  }
});



router.delete('/events/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await TanstackEvent.findOneAndDelete({ id: id });

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to delete event.', 
      error: err.message 
    });
  }
});


export default router;