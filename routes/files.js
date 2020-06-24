const express = require("express");
const fs = require("fs");
const path = require("path");
const appRoot = require("app-root-path");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

router.post("/upload", ensureAuth, async (req, res) => {
 console.log(req.files.upload);
 try {
  if (!req.files.upload)
   return res.status(500).send(JSON.stringify({ uploaded: false }));
  var data = req.files.upload.data;
  if (!data && req.files.upload.filePath)
   data = fs.readFileSync(req.files.upload.filePath);
  var newPath = path.join(appRoot.path, "files", req.user._id.toString());
  var newFileName =
   new Date().getTime().toString() + path.extname(req.files.upload.name);
  var newFile = path.join(newPath, newFileName);
  var fileUrl = `/files/${req.user._id}/${newFileName}`;
  if (!fs.existsSync(newPath)) fs.mkdirSync(newPath, { recursive: true });
  console.log("write to " + newFile);
  fs.writeFileSync(newFile, data);
  res.send(JSON.stringify({ uploaded: true, url: fileUrl }));
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
