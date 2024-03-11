import React, { useState } from 'react';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  DotGroup
} from 'pure-react-carousel';

const ProductModal = ({product}) => {
  const {images} = product;
  const media = images.nodes;

  return (
    <main className="dialog-box">
      <div className="gallary">
        <ProductGallary media={media} />
      </div>
      <div className="content">{product.title}</div>
    </main>
  );
};

function Content({slide}) {
  return (
    <div tabIndex="0">
      <div className="w-[100%]">
        <img className="max-w-full w-96" src={slide.url} />
      </div>
    </div>
  );
}

function ProductGallary({media}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <>
      <CarouselProvider
        naturalSlideWidth={100}
        isIntrinsicHeight={true}
        totalSlides={media.length}
        visibleSlides={1}
        step={1}
        currentSlide={currentSlide}
        infinite={true}
      >
        <ButtonBack>Back</ButtonBack>
        <ButtonNext>Next</ButtonNext>
        <Slider classNameTray="tray">
          {media.map((slide, index) => (
            <Slide className="slide" index={index}>
              <Content slide={slide} />
            </Slide>
          ))}
        </Slider>

        <Thumbs media={media} currentSlide={currentSlide} onClick={setCurrentSlide} />

      </CarouselProvider>
    </>
  );
}



function Thumbs({ media, currentSlide, onClick }) {
  return (
    <div className="thumbnail-container flex gap-4 items-center justify-center">
      {media.map((slide, index) => (
        <button
          key={slide.id}
          aria-label={`Go to slide ${index + 1}`}
          onClick={() => onClick(index)}
          className={`focus:ring ring-offset-2 ring-indigo-500 focus:outline-none w-16 h-16 relative ${currentSlide === index ? 'opacity-100' : 'opacity-50'}`}
        >
          <img
            src={slide.url}
            fill
            alt=""
            className="object-contain absolute left-0 top-0 bottom-0 right-0 w-full h-full"
          />
        </button>
      ))}
    </div>
  );
}



export default ProductModal;
