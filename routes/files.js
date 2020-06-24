const express = require("express");
const fs = require("fs");
const path = require("path");
const appRoot = require('app-root-path');

var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

router.post("/upload", async (req, res) => {
 try {
  fs.readFile(req.files.upload.path, (err, data) => {
   if (err) {
    console.error(err);
    res.status(500).send(JSON.stringify({ uploaded: false }));
    return;
   }
   var newPath = path.join(appRoot.path, "files", req.user._id.toString());
   var newFileName =
    new Date().getTime().toString() + path.extname(req.files.upload.name);
   var newFile = path.join(newPath, newFileName);
   var fileUrl = `/files/${req.user._id}/${newFileName}`;
   if (!fs.existsSync(newPath)) fs.mkdirSync(newPath, { recursive: true });
   console.log("write to " + newFile);
   fs.writeFileSync(newFile, data);
   res.send(JSON.stringify({ uploaded: true, url: fileUrl }));
  });
 } catch (err) {
  console.error(err);
  res.status(500).send(JSON.stringify({ uploaded: false }));
 }
});

router.get("/:userId/:filename", (req, res) => {
 console.log("request by " + req.url);
 var filePath = path.join(appRoot.path, "files", req.url);
 if (!fs.existsSync(filePath)) res.status(404).end();
 else res.sendFile(filePath);
});

module.exports = router;
