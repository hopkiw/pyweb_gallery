import React from 'react';
import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react';

// import { useKeyListener } from './useKeyListener.js';

import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

async function getImageDimensions(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.src = src;
    img.hidden = true;
    img.onload = () => {
      img.remove();
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    document.body.appendChild(img);
  });
}

function getAllImages(images) {
  const promises = images.map(async (image , index) => {
    const dimensions = await getImageDimensions(image);
    return {
        src: image,
        key: `gallery-item-${index}`,
        ...dimensions,
    };
  });
  return Promise.all(promises);
}

function getRealImagePath(image) {
  const url = new URL(image);
  return decodeURI(url.pathname).substring(1);
}

export default function Gallery({ hidden, images, selectedImages, setIndex, setSelectedImages }) {
  console.log('gallery render');
  const [photos, setPhotos] = useState([]);
  const galleryRef = useRef(null);
  const lastClicked = useRef({ index: -1 });

  // const keyStore = useKeyListener();
  const keyStore = useRef({ control: false, shift: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Control' && keyStore.current.control !== true) {
        // keyStore.current = {...keyStore.keys, 'control': true};
        keyStore.current.control = true;
      }
      if (e.key === 'Shift' && keyStore.current.shift !== true) {
        // keyStore.keys = {...keyStore.keys, 'shift': true};
        keyStore.current.shift = true;
      }
    }

    const handleKeyUp = (e) => {
      if (e.key === 'Control' && keyStore.current.control !== false) {
        // keyStore.keys = {...keyStore.keys, 'control': false};
        keyStore.current.control = false;
      }
      if (e.key === 'Shift' && keyStore.current.shift !== false) {
        // keyStore.keys = {...keyStore.keys, 'shift': false};
        keyStore.current.shift = false;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    }
  }, []);

  const mySetSelectedImages = useEffectEvent((images) => {
    setSelectedImages(images);
  }, []);

  // key bindings
  useEffect(() => {
    console.log('gallery:useEffect: add keybind handler')

    const handler = ({ key }) => {
      if (key == 'a' && keyStore.current.control) {
        console.log('ctrl-a pressed');
        mySetSelectedImages([...images]);
      }
    };

    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
    }
  }, [images, mySetSelectedImages]);

  // generate photo state from images - maybe redundant
  useEffect(() => {
    getAllImages(images).then((i) => {
      console.log('gallery render: got photos:', i);
      setPhotos(i);
    });
  }, [images]);

  // apply class to selected items - maybe move to onclick
  useEffect(() => {
    const imageElements = document.getElementsByClassName('gallery-item');
    for (const imgEl of imageElements) {
      const realPath = getRealImagePath(imgEl.src);
      if (selectedImages.includes(realPath)) {
        imgEl.classList.add('selected-image');
      } else {
        imgEl.classList.remove('selected-image');
      }
    }
  }, [selectedImages]);

  const onClick = useCallback(({ index }) => {
    var newSelected = [];

    if (keyStore.current.shift && lastClicked.index >= 0) {
      const [small, big] = index > lastClicked.index ? [lastClicked.index, index] : [index, lastClicked.index];
      newSelected = images.slice(small, big + 1);
    } else if (keyStore.current.control) {
      newSelected = [...selectedImages, images[index]];
      lastClicked.index = index;
    } else {
      newSelected = [images[index]];
      lastClicked.index = index;
    }

    setSelectedImages(newSelected);
  }, [images, keyStore, selectedImages, setSelectedImages]);

  return (
    <>
      <div className='gallery' ref={galleryRef} hidden={hidden} >
        <RowsPhotoAlbum 
          photos={photos} 
          onClick={onClick}
          render={{
            image: (props, context) => <img
              {...props}
              onDoubleClick={() => setIndex(context.index)}
              className={`gallery-item ${props.className}`}
            />,
          }}
        />
      </div>
    </>
  );
}
