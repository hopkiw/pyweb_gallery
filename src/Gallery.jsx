import React from 'react';
import { useEffect, useRef } from 'react';

import { useDragSelect } from './DragSelectContext.jsx';


function getRealImagePath(image) {
  const url = new URL(image);
  return decodeURI(url.pathname).substring(1);
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

export default function Gallery({ images, selectedCount, setIndex, setSelectedImages }) {
  console.log('gallery render');
  const galleryRef = useRef(null);

  const ds = useDragSelect();

  // dragselect
  useEffect(() => {
    console.log('gallery:useEffect: dragselect');
    if (!ds) return;

    const endId = ds.subscribe('DS:end', ({ items }) => {
      const selected = items.map(({ src }) => {
        return getRealImagePath(src);
      });
      setSelectedImages(selected);
    });

    ds.setSettings({
      area: galleryRef.current
    });

    return () => {
      ds.unsubscribe('DS:end', null, endId);
    }
  }, [ds, setSelectedImages]);



  const imgItems = images.map((image, index) => {
    return <Image
      src={image}
      key={`image-${index}`}
      onclick={() => {
        console.log('clicked index', index);
        setIndex(index)
      }}
    />
  });

  return (
    <>
      <p>&nbsp;&nbsp;Images ({imgItems.length}) { selectedCount ? ( 
        `(${selectedCount} selected)` 
      ) : null }</p>
      <hr />
      <div className='gallery' ref={galleryRef}>
        {imgItems}
      </div>
    </>

  );
}
