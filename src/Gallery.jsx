import React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useDragSelect } from './DragSelectContext.jsx';
//import { callPython } from './pythonBridge.js';

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

/*
async function getImagesForTags(tags, excludedTags) {
  const url = 'http://localhost:8080/getImages';
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
    console.error('failure to getImages:', error.message);
    return [];
  }
}

async function getTagsForImages(images) {
  const url = 'http://localhost:8080/getTags';
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
    console.error('failure to getTags:', error.message);
    return [];
  }
}
*/

async function getTagsForImages(images) {
  console.log('getTagsForImages:', images);
  // const myprommy = new Promise((resolve, reject) => {
  //   resolve({'image1': 'all', 'image2': 'these', 'image3': 'tags'});
  // });
  // return myprommy;
  // const res = await callPython('get_tags', images);
  // return res || [];
  return [];
}

async function getImagesForTags(tags, excludedTags) {
  console.log('getImagesForTags:', tags, excludedTags);
  const myprommy = new Promise((resolve, reject) => {
    resolve([]);
  });
  return myprommy;
  // const res = await callPython('get_images', [tags, excludedTags]);
  // return res || [];
}

function Image({ src, onclick }) {
  const ds = useDragSelect();
  const imgEl = useRef(null);

  useEffect(() => {
    const element = imgEl.current;
    if (!element || !ds) return;
    ds.addSelectables(element);
  }, [ds, imgEl]);

  return (
    <div className='item selectable' onClick={onclick}>
      <img src={src} ref={imgEl} className='imgitem' />
    </div>
  );
}

export default function Gallery({ tags, excludedTags, setVisibleTags, setSelectedImages }) {
  const [control, setControl] = useState(false);
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(-1);
  const galleryRef = useRef(null);

  const ds = useDragSelect();

  const keyDownFn = useCallback((event) => {
    if (event.key === 'Control') {
      setControl(true);
    }
    // ds.setSelection(null) or similar?
  }, [setControl]);

  const keyUpFn = useCallback((event) => {
    if (event.key === 'Control') {
      setControl(false);
    }
  }, [setControl]);

  useEffect(() => {
    document.addEventListener('keydown', keyDownFn, false);
    document.addEventListener('keyup', keyUpFn, false);

    return () => {
      document.removeEventListener('keydown', keyDownFn, false);
      document.removeEventListener('keyup', keyUpFn, false);
    };
  }, [keyDownFn, keyUpFn]);

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
  }, [ds, galleryRef, setSelectedImages]);

  useEffect(() => {
    if (tags) {
      const promise = getImagesForTags(tags, excludedTags);
      promise.then( val => setImages(val) );
    } 
  }, [tags, excludedTags]);

  /*
  useEffect(() => {
    if (images) {
      // const promise = getTagsForImages(images);
      // promise.then( val => setVisibleTags(val) );
      const val = getTagsForImages(images);
      setVisibleTags(val);
    }
  }, [images, setVisibleTags]);
  */

  const slides = images.map((image) => {
    return { src: image }
  });

  const imgItems = images.map((image, index) => {
    return <Image
      src={image}
      key={image}
      onclick={() => {
        if (control === false) {
          setIndex(index)
        } 
      }}
    />
  });

  window.addEventListener('pywebviewready', function() {
    console.log('pywebview is ready:', window.pywebview);
  });

  return (
    <>
      <div id='gallery' ref={galleryRef}>
        {imgItems}
      </div>
      <Lightbox
        index={index}
        open={(index >= 0)}
        close={() => setIndex(-1)}
        slides={slides}
      />
    </>
  );
}
