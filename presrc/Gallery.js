import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

async function getImagesForTags(tags) {
  const url = '/getImages';
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ tags: tags })
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error(error.message);
  }
}

function Image({ src }) {
  return (
    <div className="item selectable">
      <img src={src}></img>
    </div>
  );
}

export default function Gallery({ tags }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (tags) {
      const promise = getImagesForTags(tags);
      promise.then( val => setImages(val) );
    } 
  }, [tags]);

  var imgItems = [];
  for (const image of images) {
    imgItems.push(
      <Image
        src={image}
        key={image}
      />
    );
  }

  return (
    <div id="gallery">
      {imgItems}
    </div>
  );
}

