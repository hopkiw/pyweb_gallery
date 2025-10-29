import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

async function getImagesForTags(tags) {
  console.log('getting images for tags:', tags);

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
      <img src={'/' + src}></img>
    </div>
  );
}

export default function Gallery({ tags }) {
  console.log('loading gallery for tags:', tags);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (tags) {
      const promise = getImagesForTags(tags);
      promise.then( val => setImages(val) );
      // setImages(getImagesForTags(tags));
    } 
  }, [tags]);

  var imgItems = [];
  const example = ['item 1', 'item 2'];
  for (const image of images) {
    console.log('image is', image, 'of type', typeof(image));
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

