import React from 'react';
import { useEffect, useEffectEvent, useRef, useState } from 'react';

import { useDragSelect } from './DragSelectContext.jsx';
import { callPython } from './pythonBridge.js';
import { useKeyListener} from './useKeyListener.js';

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";


async function getTagsForImages(images) {
  console.log('getTagsForImages:', images);
  return callPython('get_tags', images);
}

async function getImagesForTags(tags, excludedTags) {
  console.log('getImagesForTags:', tags, excludedTags);
  return callPython('get_images', [tags, excludedTags]);
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
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(-1);
  const galleryRef = useRef(null);

  const ds = useDragSelect();
  const isControlPressed = useKeyListener();

  const mySetSelectedImages = useEffectEvent((images) => {
    setSelectedImages(images);
  }, [setSelectedImages]);

  useEffect(() => {
    if (!ds) return;

    const endId = ds.subscribe('DS:end', (e) => {
      mySetSelectedImages(e.items);
    });

    ds.setSettings({
      area: galleryRef.current
    });

    return () => {
      ds.unsubscribe('DS:end', null, endId);
    }
  }, [ds, galleryRef]);

  useEffect(() => {
    let ignore = false;
    if (tags) {
      getImagesForTags(tags, excludedTags).then(images => {
        if (!ignore && images) {
          setImages(images);
        }
      });
    } 
    return () => {
      ignore = true;
    };
  }, [tags, excludedTags]);

  const mySetVisibleTags = useEffectEvent((tags) => {
    setVisibleTags(tags);
  }, [setVisibleTags]);

  useEffect(() => {
    let ignore = false;
    getTagsForImages(images).then((tags) => {
      if (!ignore && tags) {
        mySetVisibleTags(tags);
      }
    });
    return () => {
      ignore = true;
    };
  }, [images]);

  const slides = images.map((image) => {
    return { src: image }
  });

  const imgItems = images.map((image, index) => {
    return <Image
      src={image}
      key={image}
      onclick={() => {
        if (!isControlPressed) {
          setIndex(index)
        }
      }}
    />
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
