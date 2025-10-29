import React from 'react';
import { useEffect, useRef, useState } from 'react';

import { useDragSelect } from "./DragSelectContext";

async function getImagesForTags(tags, excludedTags) {
  const url = '/getImages';
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ tags: tags, excludedTags: excludedTags })
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

async function getTagsForImages(images) {
  const url = '/getTags';
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ images: images })
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
  const ds = useDragSelect();
  const imgEl = useRef(null);

  useEffect(() => {
    const element = imgEl.current;
    if (!element || !ds) return;
    ds.addSelectables(element);
  }, [ds, imgEl]);

  return (
    <div className="item selectable">
      <img src={src} ref={imgEl} />
    </div>
  );
}

export default function Gallery({ tags, excludedTags, setVisibleTags }) {
  const [images, setImages] = useState([]);


  useEffect(() => {
    if (tags) {
      const promise = getImagesForTags(tags, excludedTags);
      promise.then( val => setImages(val) );
    } 
  }, [tags, excludedTags]);

  useEffect(() => {
    if (images) {
      const promise = getTagsForImages(images);
      promise.then( val => setVisibleTags(val) );
    }
  }, [images]);

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

