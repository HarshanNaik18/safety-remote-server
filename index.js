const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const routes = require("./Routes/Routes");

const app = express();
const port = 3000;

// Middleware to parse JSON bodies with a higher limit
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Enable CORS for all routes
app.use(cors());

// Use the routes defined in Routes.js
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Hello from safety remote server.");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
