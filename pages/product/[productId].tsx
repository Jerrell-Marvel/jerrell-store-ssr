import { GetServerSideProps, NextPage } from "next";
import axios from "axios";
import { useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";

type ProductDetailsProps = {
  data: {
    success: boolean;
    product: {
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
    };
  };
};

const ProductDetails: NextPage<ProductDetailsProps> = ({ data }) => {
  const router = useRouter();
  const { productId } = router.query;
  const queryClient = useQueryClient();
  const [productAmount, setProductAmount] = useState(1);
  const incrementAmount = () => {
    setProductAmount((prevAmount) => prevAmount + 1);
  };
  const decrementAmount = () => {
    setProductAmount((prevAmount) => prevAmount - 1);
  };

  const [wishlistErrMsg, setWishlistErrMsg] = useState("");

  const {
    data: addwishlistResponse,
    isError: addWishlistError,
    isLoading: addWishlistLoading,
    mutate: sendAddWishlistRequest,
  } = useMutation<any, any, string | undefined>({
    mutationFn: async (productId) => {
      const response = await axios.post("http://localhost:5000/api/v1/wishlist", { productId }, { withCredentials: true });
      const data = response.data;
      return data;
    },
    onSuccess: () => {
      // setIsWishlistModalActive((prev) => !prev);
      setWishlistErrMsg("");
    },
    onError: (addWishlistError) => {
      // if (addWishlistError.code === "ERR_NETWORK") {
      //   setWishlistErrMsg("Something went wrong please try again later");
      // } else

      if (addWishlistError?.response?.data?.message === "Duplicate value error") {
        setWishlistErrMsg("Item is already in wishlist");
      } else {
        setWishlistErrMsg("Something went wrong please try again later");
      }
    },
  });

  const addToWishlistHandler = () => {
    const isLoggedIn = queryClient.getQueryData(["profile"]);
    if (isLoggedIn) {
      sendAddWishlistRequest(productId as string);
    } else {
      // navigate("/login");
    }
  };

  return (
    <section className="bg-slate-50 px-6 pt-20 pb-6">
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2">
          <Image src={"https://source.unsplash.com/random/800x600"} alt="temporary alt" layout="responsive" width="4" height="3" />
        </div>

        <div className="w-full md:w-1/2 md:pl-8">
          <h2 className="mb-4 mt-8 text-2xl font-medium uppercase md:mt-0 lg:text-4xl">{data.product.name}</h2>
          <h4 className="font-primary font-semibold uppercase md:text-lg lg:text-xl">description</h4>
          <p>{data.product.description}</p>
          <div className="mt-4 flex w-fit border-2">
            <button className="px-4 py-2 text-2xl" onClick={decrementAmount}>
              -
            </button>
            <div className="flex items-center px-4 py-2 text-lg">{productAmount}</div>
            <button className="px-4 py-2" onClick={incrementAmount}>
              +
            </button>
          </div>
          <button
            className="mt-4 flex h-14 w-full items-center justify-center border-2 border-black bg-primary uppercase text-white transition-colors duration-300"
            // onClick={() => {
            //   addToCartHandler();
            // }}
          >
            add to cart
          </button>

          <button
            className="mt-4 flex h-14 w-full items-center justify-center border-2 border-black bg-white uppercase text-primary transition-colors duration-300"
            onClick={() => {
              addToWishlistHandler();
            }}
          >
            add to wishlist
          </button>

          {wishlistErrMsg ? (
            <span className="!mt-2 block text-red-500">
              {wishlistErrMsg}
              {/* <Link to="/wishlist" className="text-black underline">
                click here
              </Link>{" "}
              to check */}
            </span>
          ) : (
            ""
          )}

          {/* <span className="!mt-2 block text-red-500">
                  Item is already in wishlist{" "}
                  <Link to="/wishlist" className="text-black underline">
                    click here
                  </Link>{" "}
                  to check
                </span> */}
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;

export const getServerSideProps: GetServerSideProps<ProductDetailsProps> = async (context) => {
  const { productId } = context.query;

  try {
    const response = await axios.get(`http://localhost:5000/api/v1/products/${productId}`);
    const data = response.data as ProductDetailsProps["data"];
    console.log(data);
    return {
      props: {
        data,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
