import fs from 'node:fs/promises';
import RouterEvent from '../models/RouterEvent.js';
import { v4 as generateId } from 'uuid';


class NotFoundError {
  constructor(message) {
    this.message = message;
    this.status = 404;
  }
}


// export async function readData() {
//   const data = await fs.readFile('./data/router-events.json', 'utf8');
//   return JSON.parse(data);
// }

// export async function writeData(data) {
//   await fs.writeFile('./data/router-events.json', JSON.stringify(data));
// }

export async function getAll() {
  try {
    const events = await RouterEvent.find()
    return events
  } catch(err) {
    throw new NotFoundError(err.message)
  }

}

export async function get(id) {
  const ev = await RouterEvent.findById(id);
  
  if (!ev) {
    throw new NotFoundError('Could not find any events.');
  }

  return ev;
}

export async function add(data) {
  try {
    const ev = new RouterEvent({ ...data, id: generateId() })
    const savedEv = await ev.save();
    return savedEv;
  } catch (err) {  
    throw new NotFoundError('Erroe creating event in database.')
  }
  
}

export async function replace(id, data) {
  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { id: id },
      { $set: data }, 
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedEvent) {
      throw new NotFoundError("Event not found");
    }

    return updatedEvent;
  } catch (err) {
    throw new NotFoundError(err.message);
  }
}



export async function remove(id) {
  await RouterEvent.findOneAndDelete({ id: id });
}
