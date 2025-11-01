import React from 'react';
import { useEffect, useRef, useState } from 'react';

// import { useDragSelect } from './DragSelectContext';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

async function getImagesForTags(tags, excludedTags) {
  const url = '/getImages';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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

function Image({ src, onclick }) {
  // const ds = useDragSelect();
  const imgEl = useRef(null);

  /*
  useEffect(() => {
    const element = imgEl.current;
    if (!element || !ds) return;
    ds.addSelectables(element);
  }, [ds, imgEl]);
  */

  return (
    <div className='item selectable' onClick={onclick}>
      <img src={src} ref={imgEl} className='imgitem' />
    </div>
  );
}

export default function Gallery({ tags, excludedTags, setVisibleTags, setSelectedImages }) {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(-1);
  const galleryRef = useRef(null);
  // const ds = useDragSelect();

  /*
  useEffect(() => {
    if (!ds) return;

    const endId = ds.subscribe('DS:end', (e) => {
      setSelectedImages(e.items);
    });

    ds.setSettings({
      area: galleryRef.current
    });

    return () => {
      ds.unsubscribe('DS:end', null, endId);
    }
  }, [ds, galleryRef]);
  */

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

  const slides = images.map((image) => {
    return { src: image }
  });
  console.log('generated slides:', slides);

  const imgItems = images.map((image, index) => {
    return <Image
      src={image}
      key={image}
      onclick={(e) => setIndex(index)}
    />
  });
  console.log('generated imgItems:', imgItems);


  return (
    <>
      <div id='gallery' ref={galleryRef}>
        {imgItems}
      </div>
      <Lightbox
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={slides}
      />
    </>
  );
}
