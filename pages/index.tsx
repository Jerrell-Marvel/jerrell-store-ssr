import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import HomeBanner from "../components/Banner/HomeBanner/HomeBanner";
import HeroCarousel from "../components/Carousel/HeroCarousel/HeroCarousel";
import Service from "../components/Service/Service";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div id="home" className="pt-20">
      <HeroCarousel />
      <Service />
      <HomeBanner src="https://source.unsplash.com/random/1600x800" heading="lorem ipsum" />
    </div>
  );
};

export default Home;
