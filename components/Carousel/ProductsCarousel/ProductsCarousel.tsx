import { useState } from "react";
// import { useFetch } from "../../../customHooks/useFetch2";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";

// import required modules
import { FreeMode } from "swiper";
import Link from "next/link";
// import { Link } from "react-router-dom";

export type ProductsProps = ProductsType;

type ProductsType = {
  success: boolean;
  products: {
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
  }[];
};

// type ProductsCarouselProps = {
//   url: string;
//   category: string;
// };

type ProductsCarouselProps = {
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

function ProductsCarousel({ carouselProducts }: ProductsCarouselProps) {
  //   const [errorMessage, setErrorMessage] = useState("");

  //   const { data, isLoading, isError } = useFetch<ProductsType>({
  //     url: url,
  //     queryKey: ["products-carousel", category],
  //     options: {
  //       onError: () => {
  //         setErrorMessage("Something went wrong please try again later");
  //       },
  //     },
  //   });

  // useEffect(() => {
  //   // if (typeof response !== "undefined") {
  //   //   setDatas(response);
  //   // } else if (error) {
  //   //   setErrorMessage("Failed to get resources");
  //   // }
  //   if (isError) {
  //     setErrorMessage("Something went wrong please try again later");
  //   }
  // }, [isError]);

  //   if (isLoading || isError) {
  //     return (
  //       <section className="px-6 py-12 md:py-16">
  //         <div className="w-full overflow-hidden">
  //           <div className="flex h-72 w-fit">
  //             {[...Array(10)].map((element, index) => (
  //               <div className="mr-4 flex h-full w-64 animate-loading items-center justify-center rounded-sm bg-slate-200 text-center" key={index}>
  //                 {errorMessage ? errorMessage : ""}
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       </section>
  //     );
  //   }

  if (carouselProducts.products === null) {
    return (
      <section className="px-6 py-12 md:py-16">
        <div className="w-full overflow-hidden">
          <div className="flex h-72 w-fit">
            {[...Array(10)].map((element, index) => (
              <div className="mr-4 flex h-full w-64 animate-loading items-center justify-center rounded-sm bg-slate-200 text-center" key={index}>
                Failed to get products
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-12 md:py-16">
      <div>
        <div className="mb-4 flex items-end justify-between">
          <h3 className="mr-4 text-2xl font-medium sm:text-3xl md:text-4xl lg:text-5xl">Related products</h3>
          {/* <Link href={`/product-category/${category}`} className="text-lg sm:text-xl md:mr-4 md:text-2xl lg:mr-8 lg:text-3xl">
            <a>See More ➡</a>
          </Link> */}
        </div>

        <Swiper slidesPerView={"auto"} spaceBetween={30} freeMode={true} modules={[FreeMode]} grabCursor={true}>
          {carouselProducts?.products.map((product, index) => {
            return (
              <SwiperSlide className="!w-64" key={index}>
                <Link href={`/product/${product._id}`}>
                  <a className="z-10 flex w-full flex-col">
                    <img src={"https://source.unsplash.com/random/600x600"} alt="temporary alt" className="mb-3 w-full" />
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                  </a>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}

export default ProductsCarousel;

// <section className="px-6 py-12 md:py-16">
//   <div className="mb-4 flex items-end justify-between">
//     <h3 className="text-4xl font-medium mr-4">{title}</h3>
//     <Link to={`/products/${category}`} className="text-2xl lg:mr-8 md:mr-4">
//       See More ➡
//     </Link>
//   </div>

//   <Swiper slidesPerView={"auto"} spaceBetween={30} freeMode={true} modules={[FreeMode]} grabCursor={true}>
//     {data?.data?.map((d, index) => {
//       return (
//         <SwiperSlide className="!w-64" key={index}>
//           <Link to={`/products/itemCategory/${d.id}`}>
//             <div className="flex flex-col w-full">
//               <img src={d.imageUrl} alt={d.title} className="!h-72 mb-3" />
//               <h3>{d.title}</h3>
//             </div>
//           </Link>
//         </SwiperSlide>
//       );
//     })}
//     {/* <SwiperSlide className="!w-64">
//       <Link to={`/products/${category}`}>
//         <div className="flex flex-col w-full h-72 items-center justify-center">
//           <p>Show All</p>
//         </div>
//       </Link>
//     </SwiperSlide> */}
//   </Swiper>
// </section>
