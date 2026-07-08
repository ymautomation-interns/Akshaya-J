import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import EventForm from "./components/EventForm";
import EventTable from "./components/EventTable1";

function App() {

  const [events, setEvents] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/events");
      setEvents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="container">

      <h1>College Event Management System</h1>

      <EventForm
        fetchEvents={fetchEvents}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
      />

      <hr />

      <EventTable
        events={events}
        fetchEvents={fetchEvents}
        setSelectedEvent={setSelectedEvent}
      />

    </div>
  );
}

export default App;