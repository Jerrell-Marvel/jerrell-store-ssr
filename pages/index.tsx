import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import HomeBanner from "../components/Banner/HomeBanner/HomeBanner";
import HeroCarousel from "../components/Carousel/HeroCarousel/HeroCarousel";
import ProductsCarousel from "../components/Carousel/ProductsCarousel/ProductsCarousel";
import Service from "../components/Service/Service";
import styles from "../styles/Home.module.css";

const Home: NextPage<HomeProps> = ({ carouselProducts }) => {
  return (
    <div id="home" className="pt-20">
      <HeroCarousel />
      <Service />

      <HomeBanner src="https://source.unsplash.com/random/1600x800" heading="lorem ipsum" />
      <ProductsCarousel carouselProducts={carouselProducts} />

      <HomeBanner src="https://source.unsplash.com/random/1600x800" heading="lorem ipsum" />
      <ProductsCarousel carouselProducts={carouselProducts} />

      <HomeBanner src="https://source.unsplash.com/random/1600x800" heading="lorem ipsum" />
      <ProductsCarousel carouselProducts={carouselProducts} />
    </div>
  );
};

type HomeProps = {
  carouselProducts: {
    success: boolean;
    products:
      | {
          _id: string;
          name: string;
          weight: string;
          category: string;
          stock: string;
          description: string;
          price: string;
          createdAt: string;
          updatedAt: string;
          image: string;
        }[]
      | null;
  };
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/v1/products?sort=newest");
    const data = response.data as HomeProps["carouselProducts"];
    return {
      props: {
        carouselProducts: data,
      },
    };
  } catch (err) {
    return {
      props: {
        carouselProducts: { success: false, products: null },
      },
    };
  }
};

export default Home;
