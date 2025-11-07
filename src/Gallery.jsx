import React from 'react';
import { useEffect, useEffectEvent, useRef, useState } from 'react';

import { useDragSelect } from './DragSelectContext.jsx';
import { useKeyListener} from './useKeyListener.js';

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";


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

export default function Gallery({ images, setSelectedImages }) {
  console.log('gallery render');
  const [index, setIndex] = useState(-1);
  const galleryRef = useRef(null);

  const mySetSelectedImages = useEffectEvent((val) => {
    setSelectedImages(val);
  }, [setSelectedImages]);

  const ds = useDragSelect();
  const isControlPressed = useKeyListener();

  // dragselect
  useEffect(() => {
    console.log('gallery:useEffect: dragselect');
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
  }, [ds, galleryRef, mySetSelectedImages]);

  const slides = images.map((image) => ({src: image }));

  const imgItems = images.map((image, index) => {
    return <Image
      src={image}
      key={image}
      onclick={() => {
        if (!isControlPressed) {
          console.log('selecting index', index);
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
