// HTML video player only understand the url 

// Function to fetch video chunk and convert to Blob
async function fetchVideoChunk(url) {
    try {
        // Fetch the video chunk data from the server
        const response = await fetch(url);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the video chunk data as an ArrayBuffer
        const chunkData = await response.arrayBuffer();

        // Create a Blob from the chunk data
        const videoBlob = new Blob([chunkData], { type: 'video/mp4' }); // Change 'video/mp4' to your specific MIME type if necessary

        return videoBlob;
    } catch (error) {
        console.error('Error fetching video chunk:', error);
        return null;
    }
}

// Example usage
const videoChunkUrl = 'https://example.com/path/to/video/chunk'; // Replace with your actual URL

fetchVideoChunk(videoChunkUrl).then(videoBlob => {
    if (videoBlob) {
        // Create a URL for the Blob and set it as the source of a video element
        const videoUrl = URL.createObjectURL(videoBlob);

        const videoElement = document.createElement('video');
        videoElement.src = videoUrl;
        videoElement.controls = true; // Optional: to show video controls

        document.body.appendChild(videoElement); // Append the video element to the body (or any other element)
    }
});

// ----------------------------------------------------------------------------

// Backend part for this 
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Route to serve video chunks using streams
app.get('/video', (req, res) => {
    const videoPath = path.resolve(__dirname, 'path/to/your/video.mp4'); // Replace with your video file path
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize) {
            res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
            return;
        }

        const chunkSize = (end - start) + 1;
        const fileStream = fs.createReadStream(videoPath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4', // Change if your video MIME type is different
        };

        res.writeHead(206, head);
        fileStream.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4', // Change if your video MIME type is different
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Firstly we will have to create folder - handle video data
// inside this folder we will create two more folder which is client and server

// Backend side
// create node server
// inside public folder put video file
// we will serve this video file using node stream and pipe


// Frontend side
// we have to use html video tag and use video which is coming from the server

