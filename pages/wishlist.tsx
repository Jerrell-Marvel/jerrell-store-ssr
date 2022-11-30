import axios from "axios";
import { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
type WishlistType = {
  _id: string;
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

type WishlistApiResponseType = {
  success: boolean;
  wishlists: WishlistType[];
};

const Wishlist: NextPage = () => {
  //   const navigate = useNavigate();
  const [fetchErrorMessage, setFetchErrorMessage] = useState("");
  const queryClient = useQueryClient();

  const {
    data: wishlistData,
    isLoading,
    error,
    isError: isFetchError,
    refetch,
  } = useQuery<WishlistApiResponseType, any>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/api/v1/wishlist", { withCredentials: true });
      const data = response.data as WishlistApiResponseType;
      return data;
    },
    onError: (error) => {
      if (error.response.status === 401) {
        // navigate("/login");
      } else if (error.code === "ERR_NETWORK") {
        setFetchErrorMessage("Something went wrong please try again later");
      } else {
        setFetchErrorMessage("Something went wrong please try again");
      }
    },
  });

  //   const {
  //     data: wishlistData,
  //     isLoading,
  //     error,
  //     isError: isFetchError,
  //     refetch: fetchWishlist,
  //   } = useFetch<WishlistApiResponseType>({
  //     url: "/api/v1/wishlist",
  //     queryKey: ["wishlist"],
  //     options: {
  //       onError: (error) => {
  //         if (error.response.status === 401) {
  //           navigate("/login");
  //         } else if (error.code === "ERR_NETWORK") {
  //           setFetchErrorMessage("Something went wrong please try again later");
  //         } else {
  //           setFetchErrorMessage("Something went wrong please try again");
  //         }
  //       },
  //     },
  //   });

  // useEffect(() => {
  //   const isLoggedIn = queryClient.getQueryData(["profile"]);
  //   console.log(isLoggedIn);
  //   if (typeof isLoggedIn !== "undefined") {
  //     fetchWishlist();
  //   } else {
  //     navigate("/login");
  //   }
  // }, []);

  const {
    data: deleteResponse,
    isLoading: deleteLoading,
    error: deleteError,
    isError: isDeleteError,
    mutate: sendDeleteRequest,
  } = useMutation<any, any, string>({
    mutationFn: async (productId) => {
      const response = await axios.delete(`http://localhost:5000/api/v1/wishlist/${productId}`, { withCredentials: true });
      const data = response.data;
      return data;
    },
    onSuccess: (deleteWishlistResponse) => {
      queryClient.setQueryData<WishlistApiResponseType | undefined>(["wishlist"], (oldWishlist) => {
        if (oldWishlist) {
          const deletedWishlist = oldWishlist?.wishlists.filter((wishlist) => {
            return wishlist._id !== deleteWishlistResponse.wishlist._id;
          });

          return {
            ...oldWishlist,
            wishlists: deletedWishlist,
            count: deletedWishlist.length,
          };
        }
        return oldWishlist;
      });
    },
  });

  //   const {
  //     data: deleteWishlistResponse,
  //     isLoading: deleteWishlistLoading,
  //     error: deleteWishlistError,
  //     isError: isDeleteWishlistError,
  //     mutate: sendDeleteWishlistRequest,
  //   } = useApi2<DeleteWishlistApiResponseType>({
  //     url: `/api/v1/wishlist`,
  //     method: "delete",
  //     options: {
  //       onSuccess: (deleteWishlistResponse) => {
  //         queryClient.setQueryData<WishlistApiResponseType | undefined>(["wishlist"], (oldWishlist) => {
  //           if (oldWishlist) {
  //             const deletedWishlist = oldWishlist?.wishlists.filter((wishlist) => {
  //               return wishlist._id !== deleteWishlistResponse.wishlist._id;
  //             });

  //             return {
  //               ...oldWishlist,
  //               wishlists: deletedWishlist,
  //               count: deletedWishlist.length,
  //             };
  //           }
  //           return oldWishlist;
  //         });
  //       },
  //     },
  //   });

  // useEffect(() => {
  //   if (isFetchError) {
  //     if (error.code === "ERR_NETWORK") {
  //       setFetchErrorMessage("Something went wrong please try again later");
  //     } else {
  //       setFetchErrorMessage("Something went wrong please try again later");
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [wishlistData, error, isFetchError]);

  const removeWishlistHandler = (id: string) => {
    alert("are you sure to remove item from wishlist?");
    // sendDeleteWishlistRequest({ itemId: id });
    sendDeleteRequest(id);
  };

  return (
    <>
      <div className="pt-20 text-center">
        <h2 className="my-4 text-4xl font-medium uppercase">Wishlist</h2>
        <div className="bg-slate-100 p-4 text-center ">
          {!isFetchError ? (
            isLoading ? (
              //   <LoadingSpinner color="primary" />
              "Loading"
            ) : (
              <div>
                <h3 className="my-4 text-3xl font-medium">My Wishlist</h3>
                {wishlistData && wishlistData?.wishlists.length > 0 ? "" : <p>Your wishlist is empty</p>}
              </div>
            )
          ) : (
            <p>{fetchErrorMessage}</p>
          )}
        </div>
        <div className="py-6 px-6">
          <ul className="flex w-full flex-col items-center">
            {/* {isDeleteWishlistError ? <span className="mb-4 text-red-400">Failed to remove item, please try again later</span> : ""} */}
            {wishlistData?.wishlists.map((list) => {
              return (
                <li className="mb-4 flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-x-2" key={list._id}>
                  <div className="grid h-full w-full grid-cols-[1fr_1fr] justify-between p-4 sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
                    <div className="w-full bg-slate-400">
                      <img src={`/images/${list.product.image}`} alt={""} className="w-full"></img>
                    </div>
                    <div className="flex h-full flex-col items-end gap-2 pl-4 text-right">
                      <h4 className="font-medium md:text-lg lg:text-xl">{list.product.name}</h4>

                      <Link href={`/product/${list.product._id}`} className="mb-1 w-fit border-2 border-black bg-primary px-2 py-1 text-sm uppercase text-white transition-colors duration-300">
                        view item
                      </Link>

                      <button
                        className="w-20 border-2 border-black bg-white py-1 text-sm uppercase text-black transition-colors duration-300 hover:bg-slate-100"
                        onClick={() => {
                          removeWishlistHandler(list._id);
                        }}
                      >
                        {/* {deleteWishlistLoading ? <LoadingSpinner color="primary" height="h-4" width="w-4" /> : "remove"} */}
                        remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {wishlistData && wishlistData?.wishlists.length < 1 ? (
            <Link href="/product-category/all" className="w-fit border-2 border-black bg-primary px-4 py-2 text-sm uppercase text-white transition-colors duration-300">
              FIND PRODUCTS
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;