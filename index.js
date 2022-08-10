require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
app.use(cors());
app.use(express.json());

//mongo

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.755op.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const notesCollection = client.db("notebook").collection("notes");
    app.get("/notes", async (req, res) => {
      const query = {};
      const cursor = notesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.put("/notes/:id", async (req, res) => {
      console.log(req.body);
      const id = req.params.id;
      const body = req.body.initialValue;
      const filter = { _id: ObjectId(id) };
      console.log(body);
      const updateNote = {
        $set: {
          title: body.title,
          body: body.body,
        },
      };
      const result = await notesCollection.updateOne(filter, updateNote);
      res.send(result);
    });
    app.delete("/notes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await notesCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
