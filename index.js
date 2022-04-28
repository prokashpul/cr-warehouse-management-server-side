const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
require("dotenv").config();
// port setup
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

// mongoDB

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.2685i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const carCollection = client.db("CarManager").collection("inventoryItems");
    //post api
    app.post("/cars", async (req, res) => {
      const carInfo = req.body;
      const cursor = await carCollection.insertOne(carInfo);
      res.send(cursor);
    });
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);
//get global aip

app.get("/", (req, res) => {
  res.send("Welcome to Car manager Server site");
});

//listen
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
