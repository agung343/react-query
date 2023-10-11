import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient() // jika ada update array data (add/delete), query akan me-refresh data secara bts

export async function fetchEvents({signal, search, max}) {
  let url = "http://localhost:3000/events";

  if (search && max) {
    url += "?search=" + search + "&max=" + max  
  } else if (search) {
    url += `?search=` + search;
  } else if (max) {
    url += "?max=" + max // pastikan backend memiliki properti max
  }

  
  const response = await fetch(url, {
    signal: signal, // menghentikan request data jika berpindah tab/halaman
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}

export async function postNewEvent(eventData) {
  const response = await fetch("http://localhost:3000/events", {
    method: "POST",
    body: JSON.stringify(eventData),
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    const error = new Error("An Error occured while create new event")
    error.code = response.status
    error.info = await response.json()
    throw error
  }

  const {event} = await response.json()

  return event
}

export async function getSelectableImages({signal}) {
  const response = await fetch("http://localhost:3000/events/images", {signal: signal})

  if (!response.ok) {
    const error = new Error("An error occured while fetching the images")
    error.code = response.status
    error.info = await response.json()
    throw error
  }

  const {images} = await response.json()
  return images
}

export async function getSingleEvent({id, signal}) {
  const response = await fetch(`http://localhost:3000/events/${id}`, {signal: signal})

  if (!response.ok) {
    const error = new Error("An error occured while getting the event")
    error.code = response.status
    error.info = await response.json()
    throw error
  }

  const {event} = await response.json()

  return event
}

export async function updateEvent({id, event}) {
  const response = await fetch(`http://localhost:3000/events/${id}`, {
    method: "PUT",
    body: JSON.stringify({event}),
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    const error = new Error("An error occured while updating the event")
    error.code = response.status()
    error.info = await response.json()
    throw error
  }

  return response.json()
} 

export async function deleleEvent({id}) {
  const response = await fetch(`http://localhost:3000/events/${id}`, {
    method: "DELETE"
  })

  if (!response.ok) {
    const error = new Error("An error occured while deleting the event")
    error.status = response.status
    error.info = await response.json()
    throw error
  }

  return response.json()
}