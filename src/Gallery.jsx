import React from 'react';
import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react';

import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import { useKeyStore } from './KeyStoreProvider.jsx';

async function getImageDimensions(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.src = src;
    img.hidden = true;
    img.className = 'liam';
    img.onload = () => {
      img.remove();
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    document.body.appendChild(img);
  });
}

function getAllImages(images) {
  const promises = images.map(async (image , index) => {
    // const dimensions = await getImageDimensions(image);
    return {
        src: image,
        key: `gallery-item-${index}`,
        width: 500,
        height: 500
        // ...dimensions,
    };
  });
  return Promise.all(promises);
}

function getRealImagePath(image) {
  const url = new URL(image);
  return decodeURI(url.pathname).substring(1);
}

export default function Gallery({ hidden, images, selectedImages, setIndex, setSelectedImages }) {
  const [photos, setPhotos] = useState([]);
  const galleryRef = useRef(null);
  const lastSelected = useRef(-1);

  const keyStore = useKeyStore();
  console.log('gallery render, keyStore:', keyStore);

  // TODO: is this needed?
  const mySetSelectedImages = useEffectEvent((images) => {
    setSelectedImages(images);
  }, []);

  // key bindings
  useEffect(() => {
    console.log('gallery:useEffect: add keybind handler', keyStore)

    const handler = ({ key }) => {
      if (key == 'a' && keyStore.keys.control) {
        console.log('ctrl-a pressed');
        mySetSelectedImages([...images]);
      }
      if (key == 'ArrowRight') {
        console.log('right-arrow pressed');
        lastSelected.current = lastSelected.current + 1;
        if (keyStore.keys.shift) {
          mySetSelectedImages((prevstate) => {
            return [...prevstate, images[lastSelected.current]];
          });
        } else {
          console.log('without shift, setting selected images:', images[lastSelected.current]);
          mySetSelectedImages([images[lastSelected.current]]);
        }
      }
      if (key == 'ArrowLeft') {
        console.log('left-arrow pressed');
        lastSelected.current = lastSelected.current - 1;
        if (keyStore.keys.shift) {
          mySetSelectedImages((prevstate) => {
            return [...prevstate, images[lastSelected.current]];
          });
        } else {
          console.log('without shift, setting selected images:', images[lastSelected.current]);
          mySetSelectedImages([images[lastSelected.current]]);
        }
      }
    };

    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
    }
  }, [images, keyStore, mySetSelectedImages]);

  // generate photo state from images - TODO: maybe redundant
  useEffect(() => {
    getAllImages(images).then((i) => {
      setPhotos(i);
    });
  }, [images]);

  // apply class to selected items - TODO: move to onclick
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

    if (keyStore.keys.shift && lastSelected.current >= 0) {
      console.log('shift-click selection');
      const [small, big] = index > lastSelected.current ? [lastSelected.current, index] : [index, lastSelected.current];
      newSelected = images.slice(small, big + 1);
    } else if (keyStore.keys.control) {
      console.log('control-click selection');
      newSelected = [...selectedImages, images[index]];
      lastSelected.current = index;
    } else {
      newSelected = [images[index]];
      lastSelected.current = index;
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
