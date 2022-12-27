import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Image from "next/image";
import { motion } from "framer-motion";

// Images url
const heroImages = ["https://source.unsplash.com/random/1600x800", "https://source.unsplash.com/random/1600x801", "https://source.unsplash.com/random/1600x799"];

const carouselContainer = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

function HeroCarousel() {
  // const heroCarouselRef = useRef<HTMLDivElement>(null!);
  // useEffect(() => {
  //   heroCarouselRef.current.style.opacity = "1";
  // }, []);

  return (
    <motion.div className="hero-carousel transition-opacity duration-[1500ms]" variants={carouselContainer} initial="hidden" animate="visible">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        navigation
        speed={800}
        slidesPerView={1}
        loop
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="hero-carousel__slides"
      >
        {heroImages.map((img, index) => {
          return (
            <SwiperSlide className="hero-carousel__slide w-full" key={index}>
              <Image src={img} alt={img} layout="responsive" width="2" height="1" />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </motion.div>
  );
}

export default HeroCarousel;
