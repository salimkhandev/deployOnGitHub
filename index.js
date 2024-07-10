const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

// Replace with your actual connection URI (including credentials)
const uri =
  "mongodb+srv://salim:salim@formsubmition.gvbqiwh.mongodb.net/?retryWrites=true&w=majority&appName=formSubmition";

app.use(bodyParser.json()); // Parse incoming JSON data

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to MongoDB Atlas");
    const db = client.db("Form"); // Replace with your database name
    const collection = db.collection("formData"); // Replace with your collection name

    // POST route to add data
    app.post("/form", (req, res) => {
      const data = req.body;

      collection
        .insertOne(data)
        .then((result) => {
          console.log("Data added successfully:", result.insertedId);
          res.status(201).send("Data added successfully"); // Send response after successful insertion
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error adding data");
        });
    });

    // GET route for home
    app.get("/", (req, res) => {
      res.send("You are at home");
    });

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
