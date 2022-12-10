import axios, { AxiosResponse } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import HomeBanner from "../components/Banner/HomeBanner/HomeBanner";
import HeroCarousel from "../components/Carousel/HeroCarousel/HeroCarousel";
import ProductsCarousel from "../components/Carousel/ProductsCarousel/ProductsCarousel";
import Service from "../components/Service/Service";
import styles from "../styles/Home.module.css";

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
  }[];
};

const Home: NextPage<HomeProps> = ({ carouselProducts }) => {
  return (
    <div id="home" className="pt-20">
      <HeroCarousel />
      <Service />
      {carouselProducts.map((carouselProduct, idx) => {
        return (
          <div key={idx}>
            <HomeBanner src="https://source.unsplash.com/random/1600x800" heading="lorem ipsum" />
            <ProductsCarousel carouselProducts={carouselProduct} />
          </div>
        );
      })}

      {/* <HomeBanner src="https://source.unsplash.com/random/1600x800" heading="lorem ipsum" />
      <ProductsCarousel carouselProducts={carouselProducts} />

      <HomeBanner src="https://source.unsplash.com/random/1600x800" heading="lorem ipsum" />
      <ProductsCarousel carouselProducts={carouselProducts} />

      <HomeBanner src="https://source.unsplash.com/random/1600x800" heading="lorem ipsum" />
      <ProductsCarousel carouselProducts={carouselProducts} /> */}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const carouselProductsPromises: Promise<AxiosResponse<HomeProps["carouselProducts"], any>>[] = [];
    for (let i = 1; i <= 3; i++) {
      const url = `http://localhost:5000/api/v1/products?sort=newest&page=${i}`;
      const promise: Promise<AxiosResponse<HomeProps["carouselProducts"], any>> = axios.get(url);
      carouselProductsPromises.push(promise);
    }

    const responses = await Promise.all(carouselProductsPromises);
    const data = responses.map((response) => response.data);

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
