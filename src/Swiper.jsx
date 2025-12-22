import React from 'react';

import { Swiper as RealSwiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/keyboard';

import { EffectFade, Navigation, Keyboard } from 'swiper/modules';

export default function Swiper({ images, initialSlide, setIndex }) {
  const slides = images.map((src) => {
    return <SwiperSlide><img src={src}/></SwiperSlide>;
  });

  return (
    <>
      <div className='swiper_gallery'>
        <RealSwiper
          initialSlide={initialSlide}
          spaceBetween={30}
          effect={'fade'}
          fadeEffect={{ crossFade: true }}
          navigation={true}
          keyboard={{ enabled: true }}
          modules={[EffectFade, Navigation, Keyboard]}
          className="Swiper"
          onKeyPress={(swiper, keycode) => {
            if (keycode == 27) {
              swiper.destroy(false);
            }
          }}
          onActiveIndexChange={({ activeIndex }) => {
            setIndex(activeIndex);
          }}
          onDestroy={() => {
            setIndex(-1);
          }}
        > {slides} </RealSwiper>
      </div>
    </>

  );
}
