import { GetServerSideProps, NextPage } from "next";
import axios from "axios";
import { useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { UserType } from "../../components/Navbar/Navbar";
import LoadingSpinner from "../../components/Spinner/LoadingSpinner";
import Link from "next/link";
import { motion } from "framer-motion";

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
// const productVariants = {
//   visible: {
//     transition: {
//       staggerChildren: 0.2,
//     },
//   },
// };

const backgroundVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 0.5,
  },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    y: "-100%",
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const ProductDetails: NextPage<ProductDetailsProps> = ({ data }) => {
  const router = useRouter();

  //Get productId from params
  const { productId } = router.query;
  const queryClient = useQueryClient();

  const [productAmount, setProductAmount] = useState(1);

  //Increment and decrement product handler
  const incrementAmount = () => {
    setProductAmount((prevAmount) => prevAmount + 1);
  };
  const decrementAmount = () => {
    setProductAmount((prevAmount) => prevAmount - 1);
  };

  //Modal state
  const [activeModal, setActiveModal] = useState("");

  //Error state
  const [wishlistErrMsg, setWishlistErrMsg] = useState("");
  const [cartErrMsg, setCartErrMsg] = useState("");

  const {
    data: addwishlistResponse,
    isError: addWishlistError,
    isLoading: addWishlistLoading,
    mutate: sendAddWishlistRequest,
  } = useMutation<any, any, string>({
    mutationFn: async (productId) => {
      const response = await axios.post("http://localhost:5000/api/v1/wishlist", { productId }, { withCredentials: true });
      const data = response.data;
      return data;
    },
    onSuccess: () => {
      // setIsWishlistModalActive((prev) => !prev);
      setActiveModal("wishlist");
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
      router.push("/login");
    }
  };

  const {
    data: addCartResponse,
    isLoading: addCartLoading,
    error: addCartError,
    isError: isAddCartError,
    mutate: sendAddCartRequest,
  } = useMutation<any, any, { productId: string; quantity: string }>({
    mutationFn: async ({ productId, quantity }) => {
      const response = await axios.post("http://localhost:5000/api/v1/cart", { productId, quantity }, { withCredentials: true });
      const data = response.data;
      return data;
    },
    onSuccess: () => {
      queryClient.setQueryData<UserType | undefined>(["profile"], (oldProfile) => {
        if (oldProfile) {
          return {
            ...oldProfile,
            cartCount: oldProfile.cartCount + 1,
          };
        }
        return oldProfile;
      });

      setProductAmount(1);
      // setIsCartModalActive((prev) => !prev);
      setActiveModal("cart");
      setCartErrMsg("");
    },
    onError: (addCartError) => {
      console.log(addCartError?.response?.data?.message);
      if (addCartError?.response?.data?.message === "Duplicate value error") {
        setCartErrMsg("Item is already in Cart");
      } else {
        setCartErrMsg("Something went wrong please try again later");
      }
    },
  });

  const addToCartHandler = () => {
    setCartErrMsg("");

    const isLoggedIn = queryClient.getQueryData(["profile"]);
    if (isLoggedIn) {
      sendAddCartRequest({ productId: productId as string, quantity: productAmount.toString() });
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <section className="bg-slate-50 px-6 pt-20 pb-6">
        <div className="flex flex-wrap pt-8">
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
              onClick={() => {
                addToCartHandler();
              }}
            >
              {addCartLoading ? <LoadingSpinner color="white" /> : "add to cart"}
            </button>
            {cartErrMsg ? (
              <span className="!mt-2 block text-red-500">
                {cartErrMsg}
                {/* <Link to="/cart" className="text-black underline">
                click here
              </Link>{" "}
              to check */}
              </span>
            ) : (
              ""
            )}

            <button
              className="mt-4 flex h-14 w-full items-center justify-center border-2 border-black bg-white uppercase text-primary transition-colors duration-300"
              onClick={() => {
                addToWishlistHandler();
              }}
            >
              {addWishlistLoading ? <LoadingSpinner color="primary" /> : "add to wishlist"}
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
      {activeModal ? (
        <div>
          <motion.div className="fixed left-0 right-0 bottom-0 top-0 z-10 bg-black opacity-40" initial="hidden" animate="visible" variants={backgroundVariants}></motion.div>
          <div className="fixed left-0 right-0 bottom-0 top-0 z-20 pt-20 flex justify-center items-center">
            <motion.div className="absolute w-[80%] rounded-md bg-white p-6 lg:w-1/2" initial="hidden" animate="visible" variants={modalVariants}>
              <h4 className="mb-2 text-3xl font-medium uppercase">successfully added</h4>
              <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam, rem. Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, dolor.</span>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => {
                    setActiveModal("");
                    // setIsWishlistModalActive((prev) => !prev);
                  }}
                  className="w-fit border-2 border-black bg-white py-2 px-4 text-sm uppercase text-black transition-colors duration-300 hover:bg-slate-100"
                >
                  ADD MORE
                </button>
                <Link href={`/${activeModal}`}>
                  <a className="w-fit border-2 border-black bg-primary px-4 py-2 text-sm uppercase text-white transition-colors duration-300 block"> {`${activeModal} page`}</a>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
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
