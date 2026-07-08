const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;
app.get("/", (req, res) => {
    res.send("Backend is running successfully!");
});

// GET - Fetch all events
app.get("/events", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM events");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching events");
    }
});

// POST - Add a new event
app.post("/events", async (req, res) => {
    try {
        const {
            event_name,
            description,
            venue,
            event_date,
            organizer
        } = req.body;

        const result = await pool.query(
            `INSERT INTO events
            (event_name, description, venue, event_date, organizer)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                event_name,
                description,
                venue,
                event_date,
                organizer
            ]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding event");
    }
});
// UPDATE Event
app.put("/events/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            event_name,
            description,
            venue,
            event_date,
            organizer
        } = req.body;

        const result = await pool.query(
            `UPDATE events
             SET event_name=$1,
                 description=$2,
                 venue=$3,
                 event_date=$4,
                 organizer=$5
             WHERE id=$6
             RETURNING *`,
            [
                event_name,
                description,
                venue,
                event_date,
                organizer,
                id
            ]
        );

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating event");
    }
});
// DELETE Event
app.delete("/events/:id", async (req, res) => {
    try {

        const { id } = req.params;

        await pool.query(
            "DELETE FROM events WHERE id=$1",
            [id]
        );

        res.send("Event Deleted Successfully");

    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting event");
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});