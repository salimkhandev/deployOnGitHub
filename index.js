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

    // GET route to retrieve all documents
    app.get('/admin', async (req, res) => {
      try {
        // Assuming you have authentication/authorization checks in place
        const documents = await collection.find({}).toArray(); // Convert cursor to array
        // Process the documents as needed
        res.status(200).json(documents); // Send the fetched data as a JSON response
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
