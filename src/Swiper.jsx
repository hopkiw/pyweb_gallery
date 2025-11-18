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
          onKeyPress={(swiper, keycode) => {
            console.log('swiper: keypress', swiper, keycode);
            if (keycode == 27) {
              swiper.destroy(false);
            }
          }}
          onActiveIndexChange={({ activeIndex }) => {
            console.log(`swiper: setIndex(${activeIndex}`);
            setIndex(activeIndex);
          }}
          onDestroy={() => {
            console.log('swiper destroy: reset index -1');
            setIndex(-1);
          }}
        > {slides} </Swiper>
      </div>
    </>

  );
}
