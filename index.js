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
      const inventory = req.body;
      if (!inventory.name || !inventory.email) {
        return res.send({ success: false, error: "Fill up all field" });
      }
      const cursor = await carCollection.insertOne(inventory);
      res.send({
        success: true,
        message: `create successful ${inventory.name}`,
      });
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
