/**
 * JSON Store Server
 * by dr.coton
 */

// Express
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const dataDirectory = path.join(process.cwd(), "dump");

// fs-json-store lib
const { Store } = require("fs-json-store");

const saveData = (type, data) => {
  const store = new Store({ file: path.join(dataDirectory,`${type}_${new Date().toISOString()}_dump.json`) });
  store.write(data);
}

const app = express();
app.use(bodyParser.json());
app.post("/cocoa/api/upload", function (req, res) {
  saveData("ios-mpm", req.body);
  res.send("ok");
});
app.post("/cocoa/crash/send", function (req, res) {
  saveData("ios-crash", req.body);
  res.send("ok");
});
app.post("/cocoa/session", function (req, res) {
  saveData("ios-session", req.body);
  res.send("ok");
});
// '/client/send/exception'
app.post("/client/send/exception", function (req, res) {
  saveData("android-exception", req.body);
  res.send("ok");
});
// /client/connect
app.post("/client/connect", function (req, res) {
  saveData("android-session", req.body);
  res.send("ok");
});
// /api/upload
app.post("/api/upload", function (req, res) {
  saveData("android-mpm", req.body);
  res.send("ok");
});
app.listen(3000);
console.log("JSON Store Server Port : 3000");


