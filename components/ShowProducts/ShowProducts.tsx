import { NextPage } from "next";
import Link from "next/link";
import { ProductCategoryProps as ShowProductsProps } from "../../pages/product-category/[category]";

const ShowProducts: NextPage<ShowProductsProps> = ({ data }) => {
  return (
    <>
      <ul className="flex w-full flex-wrap py-10">
        {data && data.products.length < 1 ? (
          <div className="text-center">
            <span>No products found</span>

            <Link href={`/product-category/all`} className="mx-auto mt-8 block w-fit">
              <a>See All Products</a>
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
                      <img src={`https://source.unsplash.com/random/200x200`} className="w-full" alt="temporary-alt"></img>
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
