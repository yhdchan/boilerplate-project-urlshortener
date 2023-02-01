require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const originalUrls = [];
const shortUrls = [];

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;
  const index = originalUrls.indexOf(url);

  if (!url.includes("https://") && !url.includes("http://")) {
    return res.json({ error: "invalid url" });
  }

  if (index < 0) {
    originalUrls.push(url);
    shortUrls.push(shortUrls.length + 1);

    return res.json({
      original_url: url,
      short_url: shortUrls.length,
    });
  }

  return res.json({
    original_url: url,
    short_url: shortUrls[index],
  });
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const short_url = parseInt(req.params.short_url);
  const index = shortUrls.indexOf(short_url);

  if (index < 0) {
    return res.json({ error: "No such short_url" });
  }

  res.redirect(originalUrls[index]);
});

app.listen(port, function (err) {
  if (err) console.log(err);
  console.log(`Listening on port ${port}`);
});
