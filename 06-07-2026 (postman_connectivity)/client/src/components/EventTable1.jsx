import axios from "axios";

function EventTable({
  events,
  fetchEvents,
  setSelectedEvent,
}) {

  const deleteEvent = async (id) => {

    if (!window.confirm("Delete this event?")) return;

    try {

      await axios.delete(
        `http://localhost:5000/events/${id}`
      );

      fetchEvents();

    } catch (error) {
      console.log(error);
    }

  };

  return (

    <div>

      <h2>All Events</h2>

      <table>

        <thead>

          <tr>

            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Venue</th>
            <th>Date</th>
            <th>Organizer</th>
            <th>Edit</th>
            <th>Delete</th>

          </tr>

        </thead>

        <tbody>

          {events.map((event) => (

            <tr key={event.id}>

              <td>{event.id}</td>

              <td>{event.event_name}</td>

              <td>{event.description}</td>

              <td>{event.venue}</td>

              <td>{event.event_date.split("T")[0]}</td>

              <td>{event.organizer}</td>

              <td>

                <button
                  onClick={() => setSelectedEvent(event)}
                >
                  Edit
                </button>

              </td>

              <td>

                <button
                  onClick={() => deleteEvent(event.id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default EventTable;