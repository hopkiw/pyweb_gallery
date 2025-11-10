import React from 'react';
import { useEffect, useRef, useState } from 'react';

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

export default function Gallery({ hidden, images, setIndex }) {
  console.log('gallery render');
  const [photos, setPhotos] = useState([]);
  const galleryRef = useRef(null);


  useEffect(() => {
    getAllImages(images).then((i) => {
      console.log('gallery render: got photos:', i);
      setPhotos(i);
    });
  }, [images]);

  return (
    <>
      <div className='gallery' ref={galleryRef} hidden={hidden} >
        <RowsPhotoAlbum 
          photos={photos} 
          onClick={({ index }) => {
            setIndex(index);
          }}
        />
      </div>
    </>

  );
}
