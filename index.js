const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { decode } = require("jsonwebtoken");
// port setup
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());
//jwt
const verifyJWT = (req, res, next) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) {
    return res.status(401).send({ message: "unauthorize access" });
  }
  const token = authHeaders.split(" ")[1];
  jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
};

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
    const blogCollection = client.db("CarManager").collection("blog");
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
    // get api inventory
    app.get("/cars", async (req, res) => {
      const limit = parseInt(req.query.limit);
      const pageNum = parseInt(req.query.pageNum);
      const inventory = carCollection.find();
      const result = await inventory
        .skip(limit * pageNum)
        .limit(limit)
        .toArray();

      if (!result?.length) {
        return res.send({ success: false, error: "No Data Available !!" });
      }
      const count = await carCollection.estimatedDocumentCount();
      res.send({ success: true, data: result, count: count });
    });
    // Delete api
    app.delete("/cars/:id", async (req, res) => {
      const carsId = req.params.id;
      const query = { _id: ObjectId(carsId) };
      const result = await carCollection.deleteOne(query);
      res.send(result);
    });
    //single inventory api
    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carCollection.findOne(query);
      res.send(result);
    });
    //update / put
    app.put("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: updateData?.inventory?.quantity,
        },
      };

      const result = await carCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // blog post
    //post api
    app.post("/blogs", async (req, res) => {
      const blog = req.body;
      if (!blog.name || !blog.email) {
        return res.send({ success: false, error: "Fill up all field" });
      }
      const cursor = await blogCollection.insertOne(blog);
      res.send({
        success: true,
        message: `create successful`,
      });
    });
    //post get api
    //http://localhost:5000/blogs
    app.get("/blogs", async (req, res) => {
      const query = blogCollection.find();
      const blogs = await query.toArray();
      res.send(blogs);
    });
    // jwt login add token
    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.SECRET_TOKEN, {
        expiresIn: "1d",
      });
      res.send(accessToken);
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
