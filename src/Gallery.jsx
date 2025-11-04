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

export default function Gallery({ tags, excludedTags, setTagsByImage, setSelectedImages }) {
  console.log('gallery render for tags', tags);
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(-1);
  const [pythonApi, setPythonApi] = useState(undefined); // TODO: extract
  const galleryRef = useRef(null);

  const mySetTagsByImage = useEffectEvent((val) => {
    setTagsByImage(val);
  }, [setTagsByImage]);

  const mySetSelectedImages = useEffectEvent((val) => {
    setSelectedImages(val);
  }, [setSelectedImages]);

  const ds = useDragSelect();
  const isControlPressed = useKeyListener();

  // pythonapi
  useEffect(() => {
    const handler = () => { setPythonApi(window.pywebview.api) };
    window.addEventListener('pywebviewready', handler);

    return () => {
      window.removeEventListener('pywebviewready', handler);
    }
  }, []);

  // dragselect
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
  }, [ds, galleryRef, mySetSelectedImages]);

  // get images
  useEffect(() => {
    if (!pythonApi) return;

    if (tags) {
      pythonApi.get_images([tags, excludedTags]).then((val) => {
        if (val.length) {
          setImages(val);
        }
      });
    } 
  }, [tags, excludedTags, pythonApi]);

  // get tags
  useEffect(() => {
    if (!pythonApi) return;

    pythonApi.get_tags(images).then((val) => {
      if (Object.keys(val).length) {
        mySetTagsByImage(val);
      }
    });
  }, [images, pythonApi, mySetTagsByImage]);

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
      { imgItems.length ? (<p>Images ({imgItems.length})</p>) : null }
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
