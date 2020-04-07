import React from 'react';
import Slider from 'react-slick';
import Button from '../utils/button';

const HomeSlider = (props) => {

  const slides = [
    {
      img: '/images/featured/featured_home.jpg',
      lineOne: 'Fender',
      lineTwo: 'Custom Shop',
      linkTitle: 'Shop Now',
      linkTo: '/shop'
    },
    {
      img: '/images/featured/featured_home_2.jpg',
      lineOne: 'B-Stock',
      lineTwo: 'Awesome Discount',
      linkTitle: 'View Offer',
      linkTo: '/shop'
    }
  ]

  const settings = {
    dots: false,
    inifinite: true,
    speed: 500,
    slideToShow: 1,
    slidesToScroll: 1,
    arrows: false
  }

  const generateSlides = () => (
    slides ?
      slides.map((item, i) => (
        <div key={i}>
          <div className="featured_image"
            style={{
              background: `url(${item.img})`,
              height: `${window.innerHeight}px`
            }}
          >
            <div className="featured_action">
              <div className="tag title">{item.lineOne}</div>
              <div className="tag low_title">{item.lineTwo}</div>
              <div>
                <Button
                  type="default"
                  title={item.linkTitle}
                  linkTo={item.linkTo}
                  addStyles={{
                    margin: '10px 0 0 0'
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      ))
    :null
  )

  return (
    <div className="featured_container">
      <Slider {...settings} >
        { generateSlides()}
      </Slider>
    </div>
  );
};

export default HomeSlider;