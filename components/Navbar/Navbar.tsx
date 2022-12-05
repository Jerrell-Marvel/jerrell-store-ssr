import axios from "axios";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import NavCart from "./NavCart";
// import { useEffect, useState } from "react";
// import { useEffect, useState } from "react";
// import { NavLink, Link, useNavigate } from "react-router-dom";
// import NavCart from "./NavCart";
// import Button from "../Button/Button";
// import useApi from "../../customHooks/useApi2";
// import { useQueryClient } from "react-query";
// import { useFetch } from "../../customHooks/useFetch2";

type LogoutApiResponse = {
  success: boolean;
};

export type UserType = {
  username: string;
  cartCount: number;
};

const navLinks = ["about", "wishlist"];
const productCategories = ["all", "hoodie", "snacks", "jeans", "shorts", "shirts"];
const Navbar = () => {
  // const navigate = useNavigate();
  const router = useRouter();
  const [navActive, setNavActive] = useState(false);
  const [showProductCategories, setShowProductCategories] = useState(false);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch("");
    router.push(`http://localhost:3000/search?q=${search}&sort=newest&page=1`);
  };

  const {
    data,
    isLoading,
    error,
    refetch: loginUser,
  } = useQuery<UserType, any>({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/api/v1/auth/profile", { withCredentials: true });
      const data = response.data as UserType;
      return data;
    },
    retry: false,
    enabled: false,
  });

  useEffect(() => {
    loginUser();
  }, [loginUser]);

  const {
    data: logoutResponse,
    isLoading: logoutLoading,
    error: logoutError,
    isError: isLogourError,
    mutate: sendLogoutRequest,
  } = useMutation<LogoutApiResponse, any, {}>({
    mutationFn: async () => {
      const response = await axios.post("http://localhost:5000/api/v1/auth/logout", {}, { withCredentials: true });
      const data = response.data as LogoutApiResponse;
      return data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["profile"], undefined);
      window.location.reload();
    },
    onError: () => {
      alert("Something went wrong please try again later");
    },
    // url: "/api/v1/auth/logout",
    // method: "post",
    // options: {
    //   onSuccess: () => {
    //     queryClient.setQueryData(["profile"], undefined);
    //     window.location.reload();
    //   },
    //   onError: () => {
    //     alert("Something went wrong please try again later");
    //   },
    // },
  });

  // const { data, isLoading, error, isError } = useFetch<UserApiResponseType>({
  //   url: "/api/v1/auth/profile",
  //   queryKey: ["profile"],
  // });

  // const {
  //   data: logoutResponse,
  //   isLoading: logoutLoading,
  //   error: logoutError,
  //   isError: isLogourError,
  //   mutate: sendLogoutRequest,
  // } = useApi<LogoutApiResponse>({
  //   url: "/api/v1/auth/logout",
  //   method: "post",
  //   options: {
  //     onSuccess: () => {
  //       queryClient.setQueryData(["profile"], undefined);
  //       window.location.reload();
  //     },
  //     onError: () => {
  //       alert("Something went wrong please try again later");
  //     },
  //   },
  // });

  // useEffect(() => {
  //   if (typeof logoutResponse !== "undefined") {
  //   }
  // }, [logoutResponse]);

  return (
    <>
      <header className="fixed z-[99] flex h-20 w-full items-center border-b-2 bg-white px-6">
        <div className="flex w-full items-center">
          <Link href="/" passHref>
            <div className="py-6 pr-4 font-bold uppercase text-black">jStore</div>
          </Link>

          <form
            className="w-1/3 md:w-[18%]"
            onSubmit={(e) => {
              onSubmitHandler(e);
            }}
          >
            <input
              type="text"
              placeholder="Search"
              className="z-20 mr-12 h-8 w-full rounded-lg border-2 px-2 md:mr-0 "
              onChange={(e) => {
                onChangeHandler(e);
              }}
              value={search}
            />
          </form>

          <button id="hamburger" className={`absolute right-6 top-1/2 z-[103] block -translate-y-1/2 md:hidden ${navActive ? "hamburger-active" : ""}`} onClick={() => setNavActive((prev) => !prev)}>
            <span className="hamburger-line origin-top-left transition duration-300"></span>
            <span className="hamburger-line transition duration-300"></span>
            <span className="hamburger-line origin-bottom-left transition duration-300"></span>
          </button>

          <nav className={`fixed right-0  top-0 z-[102] ml-auto h-screen bg-white shadow-md transition-transform duration-300 md:static md:h-full md:translate-x-0 md:shadow-none ${navActive ? "translate-x-0" : "translate-x-full"}`}>
            <ul className="mt-20 w-48 divide-y-2 border-t-2 border-b-2 md:mt-0 md:flex md:w-auto md:items-center md:divide-y-0 md:border-none">
              {navLinks.map((navLink, index) => {
                return (
                  <li key={index}>
                    <Link href={`/${navLink}`} passHref>
                      <div className=" group block w-full py-3 pl-6 md:py-6 md:px-4 cursor-pointer" onClick={() => setNavActive((prev) => !prev)}>
                        <span className="relative w-fit font-medium uppercase after:absolute after:-bottom-1/4 after:left-1/2 after:block after:h-[3px]  after:w-0 after:bg-slate-800 after:transition-all after:duration-300 after:content-[''] group-hover:after:left-0 group-hover:after:right-0 group-hover:after:w-full text-black">
                          {navLink}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}

              <li>
                <div onClick={() => setShowProductCategories((prev) => !prev)} className="group relative block w-full cursor-pointer py-3 pl-6 md:py-6 md:px-4">
                  <div className="relative w-fit font-medium uppercase after:absolute after:-bottom-1/4 after:left-1/2 after:block after:h-[3px] after:w-0 after:bg-slate-800 after:transition-all after:duration-300  group-hover:after:left-0 group-hover:after:right-0 group-hover:after:w-full text-black flex items-center">
                    <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                      <path d="m16.843 10.211c.108-.141.157-.3.157-.456 0-.389-.306-.755-.749-.755h-8.501c-.445 0-.75.367-.75.755 0 .157.05.316.159.457 1.203 1.554 3.252 4.199 4.258 5.498.142.184.36.29.592.29.23 0 .449-.107.591-.291 1.002-1.299 3.044-3.945 4.243-5.498z" />
                    </svg>
                    products
                  </div>

                  <div className={`w-full flex-col divide-y-[1px] rounded-lg bg-white pt-2 md:absolute md:left-0  md:top-full md:hidden md:w-full md:py-2 md:shadow-lg md:group-hover:flex ${showProductCategories ? "flex" : "hidden"}`}>
                    {productCategories.map((category, index) => {
                      return (
                        <Link href={`/product-category/${category}`} passHref key={index}>
                          <div className="py-2 capitalize hover:underline md:flex md:w-full md:justify-center md:px-4 text-black" onClick={() => setNavActive((prev) => !prev)}>
                            {category}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </li>

              <NavCart amount={data?.cartCount} />

              <li>
                {/* {data ? (
                  <div
                    onClick={() => {
                      sendLogoutRequest({});
                    }}
                    className="z-10 block py-3 pl-6 md:py-0 md:pl-0"
                  >
                    <Button>Logout</Button>
                  </div>
                ) : (
                  <NavLink to={`/login`} className="z-10 block py-3 pl-6 md:py-0 md:pl-0">
                    <Button>Login</Button>
                  </NavLink>
                )} */}
                {data ? (
                  <div
                    className="z-10 block py-3 pl-6 md:py-0 md:pl-0"
                    onClick={() => {
                      sendLogoutRequest({});
                    }}
                  >
                    <button className="w-fit rounded-md border-2 border-black bg-primary py-2 px-6 text-white transition duration-200 ease-in-out hover:bg-white hover:text-primary">Logout</button>
                  </div>
                ) : (
                  <Link href="/login" passHref>
                    <div className="z-10 block py-3 pl-6 md:py-0 md:pl-0">
                      <button className="w-fit rounded-md border-2 border-black bg-primary py-2 px-6 text-white transition duration-200 ease-in-out hover:bg-white hover:text-primary">Login</button>
                    </div>
                  </Link>
                )}
                {/* <Link href="/login" passHref>
                  <div className="z-10 block py-3 pl-6 md:py-0 md:pl-0">
                    <button className="w-fit rounded-md border-2 border-black bg-primary py-2 px-6 text-white transition duration-200 ease-in-out hover:bg-white hover:text-primary">Login</button>
                  </div>
                </Link> */}
              </li>
            </ul>
          </nav>
        </div>
        <div onClick={() => setNavActive((prev) => !prev)} className={`fixed left-0 right-0 bottom-0 top-0 z-[100] bg-black opacity-40 md:hidden ${navActive ? "visible" : "invisible"}`}></div>
      </header>
    </>
  );
};

export default Navbar;

// const Navbar: NextPage = () => {
//   const router = useRouter();
//   //   const [activePage, setActivePage] = useState<string>("");
//   //   useEffect(() => {
//   //     const path = window.location.href.split("/");
//   //     setActivePage(path[3]);

//   //     console.log(router.asPath);
//   //   });

//   console.log(router.asPath);

//   const navLinks = [{ path: "/" }, { path: "/about" }, { path: "/product-category/all" }];
//   return (
//     <>
//       {navLinks.map((link, index) => {
//         return (
//           <div key={index}>
//             <Link href={link.path}>
//               <a className={router.asPath.split("?")[0] === link.path ? "active" : ""}>{link.path}</a>
//             </Link>
//             <br></br>
//           </div>
//         );
//       })}
//     </>
//   );
// };

// export default Navbar;
