import { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

type ShowProductsProps = {
  data: {
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
    count: number;
    totalCount: number;
  };
};

const ShowProducts: NextPage<ShowProductsProps> = ({ data }) => {
  if (!data.success || data.products === null) {
    return (
      <>
        <ul className="flex w-full flex-wrap py-10">
          {[...Array(10)].map((element, index) => {
            return (
              <li className="h-96 w-full p-3 sm:w-1/2 md:w-1/3 lg:w-1/4" key={index}>
                <div className="flex h-full w-full flex-col gap-4 rounded-xl bg-white p-4 transition-all duration-300">
                  <div className="flex-1 animate-loading bg-slate-200"></div>
                  <div className="flex flex-[5] animate-loading items-center justify-center bg-slate-200 px-6 text-center">Failed to get data</div>
                  <div className="flex-[2] animate-loading bg-slate-200"></div>
                </div>
              </li>
            );
          })}
        </ul>
      </>
    );
  }
  return (
    <>
      <ul className="flex w-full flex-wrap py-10">
        {data && data.products.length < 1 ? (
          <div className="text-center w-full flex flex-col items-center">
            <span>No products found</span>

            <Link href={`/product-category/all`}>
              <a className="w-fit border-2 border-black bg-primary px-4 py-2 text-sm uppercase text-white transition-colors duration-300 block mt-6">See All Products</a>
            </Link>
          </div>
        ) : (
          data?.products.map((product, index) => {
            return (
              <Link href={`/product/${product._id}`} key={product._id}>
                <li className="w-full p-3 sm:w-1/2 md:w-1/3 lg:w-1/4">
                  <div className="flex h-full flex-col gap-4 rounded-xl bg-white p-4 transition-transform duration-300 hover:scale-105">
                    <h3 className="text-xl font-medium">{product.name}</h3>
                    <div>
                      <Image src={"https://source.unsplash.com/random/600x600"} alt="temporary alt" layout="responsive" width="1" height="1" />
                    </div>
                    <div className="">{product.description}</div>
                    <div>{product.price}</div>
                  </div>
                </li>
              </Link>
            );
          })
        )}
      </ul>
    </>
  );
};

export default ShowProducts;
