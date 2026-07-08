import { useState, useEffect } from "react";
import axios from "axios";

function EventForm({
  fetchEvents,
  selectedEvent,
  setSelectedEvent,
}) {

  const [event, setEvent] = useState({
    event_name: "",
    description: "",
    venue: "",
    event_date: "",
    organizer: "",
  });

  useEffect(() => {
    if (selectedEvent) {
      setEvent({
        ...selectedEvent,
        event_date: selectedEvent.event_date.split("T")[0],
      });
    }
  }, [selectedEvent]);

  const handleChange = (e) => {
    setEvent({
      ...event,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (selectedEvent) {

        await axios.put(
          `http://localhost:5000/events/${selectedEvent.id}`,
          event
        );

        alert("Event Updated Successfully!");

      } else {

        await axios.post(
          "http://localhost:5000/events",
          event
        );

        alert("Event Added Successfully!");

      }

      setEvent({
        event_name: "",
        description: "",
        venue: "",
        event_date: "",
        organizer: "",
      });

      setSelectedEvent(null);

      fetchEvents();

    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div className="form-container">

      <h2>
        {selectedEvent ? "Edit Event" : "Add Event"}
      </h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="event_name"
          placeholder="Event Name"
          value={event.event_name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={event.description}
          onChange={handleChange}
        />

        <input
          type="text"
          name="venue"
          placeholder="Venue"
          value={event.venue}
          onChange={handleChange}
        />

        <input
          type="date"
          name="event_date"
          value={event.event_date}
          onChange={handleChange}
        />

        <input
          type="text"
          name="organizer"
          placeholder="Organizer"
          value={event.organizer}
          onChange={handleChange}
        />

        <button type="submit">
          {selectedEvent ? "Update Event" : "Add Event"}
        </button>

      </form>

    </div>
  );
}

export default EventForm;