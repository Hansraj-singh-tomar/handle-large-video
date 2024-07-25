const express = require("express");
const status = require("express-status-monitor");
const path = require("path");
const fs = require("fs");
const zlib = require("zlib");

const app = express();

const port = 3000;

app.use(status());


// another way to serve static file from the public directory 
// but not recommendate way  
app.use(express.static('public'));

// stream read (sample.txt) --> Zipper --> fs write stream
// fs.createReadStream("./txtFile.txt").pipe(zlib.createGzip().pipe(fs.createWriteStream("./txtFile.zip")))

app.get("/", (req, res) => {
    fs.readFile("./txtFile.txt", (err, data) => {
        res.end(data);
    })
});

app.get("/stream", (req, res) => {
    const stream = fs.createReadStream("./txtFile.txt");
    stream.on("data", (chunk) => res.write(chunk));
    stream.on("end", () => res.end());
});


fs.createReadStream("./txtFile.txt").pipe(zlib.createGzip().pipe(fs.createWriteStream("./txtFile.zip")))
app.get("/gzip", (req, res) => {
    // 400MB file -> 400MB(ZIP) -> 400MB write

    // Stream Read (400MB file) -> 400MB(ZIP) -> 400MB write
});

// Route to serve the video file
app.get('/video', (req, res) => {
    const videoPath = path.join(__dirname, 'public', 'video2.mp4');
    res.sendFile(videoPath);
});


app.listen(port, () => {
    console.log("server is listening on port 3000");
});


// server static files from the public directory
// app.use(express.static(path.join(__dirname, 'public')));

// console.log(path.join(__dirname)); // C:\Users\A2\Desktop\Programming Files\handle large video\server\src

