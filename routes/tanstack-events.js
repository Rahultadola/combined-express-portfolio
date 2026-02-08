import fs from 'node:fs/promises';
import express from 'express';

const router = express.Router();


router.get('/events', async (req, res) => {
  const { max, search } = req.query;
  const eventsFileContent = await fs.readFile('./data/tanstack-events.json');
  let events = JSON.parse(eventsFileContent);

  if (search) {
    events = events.filter((event) => {
      const searchableText = `${event.title} ${event.description} ${event.location}`;
      return searchableText.toLowerCase().includes(search.toLowerCase());
    });
  }

  if (max) {
    events = events.slice(events.length - max, events.length);
  }

  res.json({
    events: events.map((event) => ({
      id: event.id,
      title: event.title,
      image: event.image,
      date: event.date,
      location: event.location,
    })),
  });
});


router.get('/events/images', async (req, res) => {
  const imagesFileContent = await fs.readFile('./data/tanstack-images.json');
  const images = JSON.parse(imagesFileContent);

  res.json({ images });
});



router.get('/events/:id', async (req, res) => {
  const { id } = req.params;

  const eventsFileContent = await fs.readFile('./data/tanstack-events.json');
  const events = JSON.parse(eventsFileContent);

  const event = events.find((event) => event.id === id);

  if (!event) {
    return res
      .status(404)
      .json({ message: `For the id ${id}, no event could be found.` });
  }

  setTimeout(() => {
    res.json({ event });
  }, 1000);
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

  const eventsFileContent = await fs.readFile('./data/tanstack-events.json');
  const events = JSON.parse(eventsFileContent);

  const newEvent = {
    id: Math.round(Math.random() * 10000).toString(),
    ...event,
  };

  events.push(newEvent);

  await fs.writeFile('./data/tanstack-events.json', JSON.stringify(events));

  res.json({ event: newEvent });
});



router.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const { event } = req.body;

  console.log("id: ",id, "\nevent:", req.body)

  if (!event) {
    return res.status(400).json({ message: 'Event is required' });
  }

  if (
    !event.title?.trim() ||
    !event.description?.trim() ||
    !event.date?.trim() ||
    !event.time?.trim() ||
    !event.image?.trim() ||
    !event.location?.trim()
  ) {
    return res.status(400).json({ message: 'Invalid data provided.' });
  }

  const eventsFileContent = await fs.readFile('./data/tanstack-events.json');
  const events = JSON.parse(eventsFileContent);

  const eventIndex = events.findIndex((event) => event.id === id);

  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }

  events[eventIndex] = {
    id,
    ...event,
  };

  await fs.writeFile('./data/tanstack-events.json', JSON.stringify(events));

  setTimeout(() => {
    res.json({ event: events[eventIndex] });
  }, 1000);
});




router.delete('/events/:id', async (req, res) => {
  const { id } = req.params;

  const eventsFileContent = await fs.readFile('./data/tanstack-events.json');
  const events = JSON.parse(eventsFileContent);

  const eventIndex = events.findIndex((event) => event.id === id);

  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }

  events.splice(eventIndex, 1);

  await fs.writeFile('./data/tanstack-events.json', JSON.stringify(events));

  setTimeout(() => {
    res.json({ message: 'Event deleted' });
  }, 1000);
});

export default router;