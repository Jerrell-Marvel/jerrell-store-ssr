import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import HeroCarousel from "../components/Carousel/HeroCarousel/HeroCarousel";
import Service from "../components/Service/Service";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div id="home" className="pt-20">
      <HeroCarousel />
      <Service />
    </div>
  );
};

export default Home;
