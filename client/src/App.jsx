// eslint-disable-next-line no-unused-vars
import React from 'react';

function App() {
  return (
    <div className="App">
      <h1>Video Player</h1>
      <video width="600" controls>
        <source src="http://localhost:3000/video" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default App;
