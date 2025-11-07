import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/keyboard';

import { EffectFade, Navigation, Keyboard } from 'swiper/modules';

export default function MySwiper({ images, initialSlide, setIndex }) {
  console.log('MySwiper render');
  const slides = images.map((src) => { 
    return <SwiperSlide><img src={src}/></SwiperSlide>;
  });
  console.log('returning lightbox with slides', slides);

  return (
    <>
      <div className='swiper_gallery'>
        <Swiper
          initialSlide={initialSlide}
          spaceBetween={30}
          effect={'fade'}
          fadeEffect={{ crossFade: true }}
          navigation={true}
          keyboard={{ enabled: true }}
          modules={[EffectFade, Navigation, Keyboard]}
          className="mySwiper"
          onActiveIndexChange={({ activeIndex }) => setIndex(activeIndex)}
        > {slides} </Swiper>
      </div>
    </>

  );
}
