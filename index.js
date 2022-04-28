const express = require("express");
const cors = require("cors");

const app = express();

// port setup
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//get global aip

app.get("/", (req, res) => {
  res.send("Welcome to Car manager Server site");
});

//listen
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
