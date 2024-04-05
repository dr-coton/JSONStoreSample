/**
 * JSON Store Server
 * by dr.coton
 */

// Express
const express = require("express");
const bodyParser = require("body-parser");

// fs-json-store lib
const { Store } = require("fs-json-store");
const store = new Store({ file: "data.json" });

const app = express();
app.use(bodyParser.json());

app.post("/cocoa/api/upload", function (req, res) {
  console.log("Received crash report");
  store.write(req.body);
  res.send("ok");
});

app.listen(3000);
console.log("JSON Store Server Port : 3000");
