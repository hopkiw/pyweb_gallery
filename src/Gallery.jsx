import React from 'react';
import { useEffect, useEffectEvent, useRef } from 'react';

import { useKeyStore } from './useKeyStore.js';

function getRealImagePath(image) {
  const url = new URL(image);
  return decodeURI(url.pathname).substring(1);
}

function Image({ src, index, onclick, ondoubleclick }) {
  const ref = useRef(null);

  return (
    <div className='item selectable' onClick={() => onclick({ index, img: ref.current })} onDoubleClick={() => ondoubleclick({ index, img: ref.current })} key={index}>
      <img
        src={src}
        ref={ref}
        className='imgitem' 
      />
    </div>
  );
}

export default function Gallery({
  hidden,
  images,
  selectedImages,
  setIndex,
  setSelectedImages,
  setScrollPos }) {
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
      console.log('gallery:useEffect: remove keybind handler', keyStore)
      window.removeEventListener('keydown', handler);
    }
  }, [images, keyStore, mySetSelectedImages]);

  // apply class to selected items - TODO: move to onclick
  useEffect(() => {
    const imageElements = document.getElementsByClassName('imgitem');
    for (const imgEl of imageElements) {
      const realPath = getRealImagePath(imgEl.src);
      if (selectedImages.includes(realPath)) {
        imgEl.classList.add('selected-image');
      } else {
        imgEl.classList.remove('selected-image');
      }
    }
  }, [selectedImages]);

  const onClick = ({ index, img }) => {
    console.log('clicked on', index, img);
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

    img.classList.add('selected-image');
    setSelectedImages(newSelected);
  };

  const onDoubleClick = (index) => {
    console.log('double-clicked on', index);

    setScrollPos(window.pageYOffset);
    setIndex(index);
  };

  const imgItems = images.map((src, index) => {
    return <Image index={index} src={src} onclick={onClick} ondoubleclick={onDoubleClick} />
  });

  return (
    <>
      <div className='gallery' ref={galleryRef} hidden={hidden} >
        {imgItems}
      </div>
    </>
  );
}
