import axios from "axios";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { UserType } from "../components/Navbar/Navbar";
import LoadingSpinner from "../components/Spinner/LoadingSpinner";

type CartType = {
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
  quantity: string;
};

type CartApiResponseType = {
  success: boolean;
  items: CartType[];
};

type UpdateCartApiResponseType = {
  success: boolean;
  item: {
    createdAt: string;
    createdBy: string;
    product: string;
    updatedAt: string;
    __v: 0;
    _id: string;
    quantity: string;
  };
};

const Cart: NextPage = () => {
  const [fetchErrorMessage, setFetchErrorMessage] = useState("");
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    data: cartData,
    isLoading: fetchLoading,
    error: fetchError,
    isError: isFetchError,
    refetch: fetchCart,
  } = useQuery<CartApiResponseType, any>({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/api/v1/cart", { withCredentials: true });
      const data = response.data as CartApiResponseType;
      return data;
    },
    onError: (fetchError) => {
      if (fetchError?.response?.status === 401) {
        router.push("/login");
      } else if (fetchError?.code === "ERR_NETWORK") {
        setFetchErrorMessage("Something went wrong please try again later");
      } else {
        setFetchErrorMessage("Something went wrong please try again");
      }
    },
    retry: false,
  });

  const {
    data: deleteCartResponse,
    isLoading: deleteCartLoading,
    error: deleteCartError,
    isError: isDeleteCartError,
    mutate: sendDeleteCartRequest,
  } = useMutation<any, any, string>({
    mutationFn: async (productId) => {
      const response = await axios.delete(`http://localhost:5000/api/v1/cart/${productId}`, { withCredentials: true });
      const data = response.data;
      return data;
    },

    onSuccess: (deleteCartResponse) => {
      queryClient.setQueryData<CartApiResponseType | undefined>(["cart"], (oldCart) => {
        if (oldCart) {
          const deletedCart = oldCart?.items.filter((item) => {
            return item._id !== deleteCartResponse.item._id;
          });
          return {
            ...oldCart,
            items: deletedCart,
            count: deletedCart.length,
          };
        }
        return oldCart;
      });
      queryClient.setQueryData<UserType | undefined>(["profile"], (oldProfile) => {
        if (oldProfile) {
          return {
            ...oldProfile,
            cartCount: oldProfile.cartCount - 1,
          };
        }
        return oldProfile;
      });
    },
  });

  const {
    data: updateCartResponse,
    isLoading: updateCartLoading,
    error: updateCartError,
    mutate: sendUpdateCartRequest,
    isError: isUpdateCartError,
  } = useMutation<UpdateCartApiResponseType, any, { productId: string; quantity: string }>({
    // url: `/api/v1/cart`,
    // method: "patch",
    mutationFn: async ({ productId, quantity }) => {
      const response = await axios.patch(`http://localhost:5000/api/v1/cart/${productId}`, { quantity }, { withCredentials: true });
      const data = response.data as UpdateCartApiResponseType;

      return data;
    },

    onMutate: async (newCart) => {
      await queryClient.cancelQueries(["cart"]);
      const previousCartData = queryClient.getQueryData<CartApiResponseType>(["cart"]);

      if (previousCartData) {
        queryClient.setQueryData<CartApiResponseType | undefined>(["cart"], (oldQueryData) => {
          if (oldQueryData) {
            const updatedCart = oldQueryData.items.map((cart) => {
              if (cart._id === newCart.productId) {
                return {
                  ...cart,
                  quantity: newCart.quantity,
                };
              } else {
                return cart;
              }
            });

            return {
              success: true,
              items: updatedCart,
            };
          }
        });
      }

      return { previousCartData };
    },

    onError: (_err, _newTodo, context: any) => {
      queryClient.setQueryData(["cart"], context.previousCartData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });

  const changeQuantityHandler = (id: string, quantity: string) => {
    if (Number(quantity) < 1) {
      return;
    }
    sendUpdateCartRequest({ productId: id, quantity });
  };

  return (
    <>
      <div className="pt-20 text-center">
        <h2 className="my-4 text-4xl font-medium uppercase">Cart</h2>
        <div className="bg-slate-100 p-4 text-center ">
          {!isFetchError ? (
            fetchLoading ? (
              <LoadingSpinner color="black" />
            ) : (
              <div>
                <h3 className="my-4 text-3xl font-medium">My Cart</h3>
                {cartData && cartData?.items.length > 0 ? "" : <p>Your cart is empty</p>}
              </div>
            )
          ) : (
            <p>{fetchErrorMessage}</p>
          )}
        </div>
        <div className="py-6 px-6">
          <ul className="flex w-full flex-col items-center">
            {cartData?.items.map((item) => {
              return (
                <li className="mb-4 flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-x-2" key={item._id}>
                  <div className="grid h-full w-full grid-cols-[1fr_1fr] justify-between p-4 sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
                    <div className="w-full bg-slate-400">
                      <img src={`/images/${item.product.image}`} alt={""} className="w-full"></img>
                    </div>
                    <div className="flex h-full flex-col items-end gap-2 pl-4 text-right">
                      <h4 className="font-medium md:text-lg lg:text-xl">{item.product.name}</h4>

                      <Link href={`/product/${item.product._id}`} className="mb-1 w-fit border-2 border-black bg-primary px-2 py-1 text-sm uppercase text-white transition-colors duration-300">
                        view item
                      </Link>
                      <div className="flex">
                        <button
                          className="px-4 py-2 pl-0 text-2xl"
                          onClick={() => {
                            const updatedQuantity = Number(item.quantity) - 1;
                            changeQuantityHandler(item._id, updatedQuantity.toString());
                          }}
                        >
                          -
                        </button>
                        <span className="flex items-center px-4 py-2 text-lg">{item.quantity}</span>

                        <button
                          className="px-4 py-2 pr-0"
                          onClick={() => {
                            // const updatedQuantity = Number(item.quantity) + 1;
                            // changeQuantityHandler(item._id, { quantity: updatedQuantity.toString() });
                            const updatedQuantity = Number(item.quantity) + 1;
                            changeQuantityHandler(item._id, updatedQuantity.toString());
                          }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="h-10 w-20 border-2 border-black bg-white py-2 px-3 text-sm uppercase text-black transition-colors duration-300  hover:bg-slate-100"
                        onClick={() => {
                          // removeWishlistHandler(item._id);
                          sendDeleteCartRequest(item._id);
                        }}
                      >
                        {deleteCartLoading ? <LoadingSpinner color="black" height="h-4" width="w-4" /> : "remove"}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {cartData && cartData?.items.length < 1 ? (
            <Link href="/wishlist" className="w-fit border-2 border-black bg-primary px-4 py-2 text-sm uppercase text-white transition-colors duration-300">
              WISHLIST PAGE
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
