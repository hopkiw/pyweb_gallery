import React from 'react';
import { useEffect, useRef, useState } from 'react';

import { useKeyListener } from './useKeyListener.js';

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
  console.log('gallery render, selectedImages:', selectedImages);
  const [photos, setPhotos] = useState([]);
  const galleryRef = useRef(null);
  const lastClicked = useRef({ 'index': -1 });

  const keyStore = useKeyListener();

  useEffect(() => {
    getAllImages(images).then((i) => {
      console.log('gallery render: got photos:', i);
      setPhotos(i);
    });
  }, [images]);

  useEffect(() => {
    const imageElements = document.getElementsByClassName('gallery-item');
    console.log('checking for selectedImages:', selectedImages);
    for (const imgEl of imageElements) {
      const realPath = getRealImagePath(imgEl.src);
      console.log('checking if image is selected:', realPath);
      if (selectedImages.includes(realPath)) {
        console.log('add tag to', imgEl);
        imgEl.classList.add('selected-image');
      } else {
        console.log('this image not selected');
        imgEl.classList.remove('selected-image');
      }
    }
  }, [selectedImages]);

  // callback
  const onClick = ({ index }) => {
    var newSelected = [];

    if (keyStore.shift && lastClicked.index >= 0) {
      console.log(`selected from ${lastClicked.index} to ${index}`);
      newSelected = images.slice(lastClicked.index, index + 1);
    } else {
      newSelected = [images[index]];
    }

    setSelectedImages(newSelected);
    lastClicked.index = index;
  };

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
