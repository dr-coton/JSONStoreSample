/**
 * JSON Store Server
 * by dr.coton
 */

// Express
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const zlib = require("zlib"); // zlib 라이브러리 추가

const dataDirectory = path.join(process.cwd(), "dump");

// fs-json-store lib
const { Store } = require("fs-json-store");

const saveData = (type, data) => {
  // 함수 내에서 데이터 압축 여부 확인
  const isGzip = Buffer.isBuffer(data) && data[0] === 0x1f && data[1] === 0x8b;

  // gzip 압축이면 압축 해제
  if (isGzip) {
    zlib.unzip(data, (err, decompressedData) => {
      if (err) {
        console.error("Error decompressing gzip data:", err);
        return;
      }
      // 압축 해제된 데이터를 저장
      const store = new Store({ file: path.join(dataDirectory,`${type}_${new Date().toISOString()}_dump.json`) });
      store.write(JSON.parse(decompressedData.toString()));
    });
  } else {
    // gzip 압축이 아니면 그냥 저장
    const store = new Store({ file: path.join(dataDirectory,`${type}_${new Date().toISOString()}_dump.json`) });
    store.write(data);
  }
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


