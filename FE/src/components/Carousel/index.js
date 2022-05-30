import { Container } from "@material-ui/core";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import CarouselImage1 from "../../assets/carousel-image-1.jpg";
import CarouselImage2 from "../../assets/carousel-image-2.jpg";
import CarouselImage3 from "../../assets/carousel-image-3.jpg";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import BackSession from "../../assets/back-session.png";
import NextSession from "../../assets/next-session.png";

const photos = [
  {
    name: "carousel-image-1",
    url: CarouselImage1,
  },
  {
    name: "carousel-image-2",
    url: CarouselImage2,
  },
  {
    name: "carousel-image-3",
    url: CarouselImage3,
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  carouselContainer: {
    width: "100%",
    position: "relative",
  },
  carouselImg: {
    display: "block",
    width: "100%",
  },
}));

const StyledSlider = styled(Slider)`
   {
    .slick-prev {
      left: 15px !important;
      background-image: url(${BackSession});
    }
    .slick-next {
      right: 15px !important;
      background-image: url(${NextSession});
    }
    .slick-arrow {
      background-position: center;
      background-size: cover;
      width: 50px;
      height: 50px;
      opacity: 0.7;
      z-index: 1;
    }
    .slick-arrow::before {
      content: "" !important;
    }
    //dots
    .slick-dots {
      bottom: 12% !important;
    }
    .slick-dots li {
      margin: 0 2px !important;
    }
    .slick-dots .slick-active button::before {
      color: #f50057 !important;
    }
    .slick-dots li button::before {
      color: #d8d8d8;
      font-size: 14px;
      opacity: 1 !important;

      transition: all 0.2s;
    }
    .slick-dots li button:hover::before {
      color: #f50057 !important;
      opacity: 0.5 !important;
    }

    .slick-dots .slick-active button:hover::before {
      opacity: 1 !important;
    }
  }
`;

function Carousel(props) {
  const classes = useStyles();
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };
  return (
    <section id="carousel" className={classes.root}>
      <StyledSlider {...settings}>
        {photos.map((item, index) => {
          return (
            <div key={item.name} className={classes.carouselContainer}>
              <img
                name={item.name}
                src={item.url}
                className={classes.carouselImg}
              />
            </div>
          );
        })}
      </StyledSlider>
    </section>
  );
}

export default Carousel;
