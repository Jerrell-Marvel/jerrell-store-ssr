import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination/Pagination";
import ShowProducts from "../../components/ShowProducts/ShowProducts";
import axios from "axios";
import SortProductsDropdown from "../../components/Dropdown/SortProductsDropdown";
import { useQuery } from "react-query";
import ShowProductsSkeleton from "../../components/ShowProducts/ShowProductsSkeleton";

export type ProductCategoryProps = {
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

const ProductCategory: NextPage<ProductCategoryProps> = ({ data }) => {
  const router = useRouter();

  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    setFirstRender(false);
    console.log("[] called");
  }, []);
  const {
    data: products,
    isLoading,
    isFetching,
  } = useQuery<ProductCategoryProps["data"]>({
    queryKey: ["product", router.asPath],
    queryFn: async () => {
      try {
        const { sort = "newest", page = "1", category } = router.query;
        // const url = `http://localhost:5000/api/v1/products?sort=${sort}&page=${page}&category=`;
        const response = await axios.get(`http://localhost:5000/api/v1/products`, {
          params: {
            sort,
            page,
            category: category === "all" ? "" : category,
          },
        });
        const data = response.data as ProductCategoryProps["data"];
        return data;
      } catch (err) {
        return { success: false, products: null, count: 0, totalCount: 0 };
      }
    },
    // initialData: { success: false, products: null, count: 5, totalCount: 18 },
    refetchOnWindowFocus: false,
    retry: false,
  });

  return (
    <>
      <div className="bg-slate-200 pt-20 pb-8">
        <div className="bg-slate-100 px-6 py-10">
          <SortProductsDropdown />
          {/* {firstRender ? JSON.stringify(data) : JSON.stringify(products)} */}

          {firstRender ? (
            <div>
              <ShowProducts data={data} /> <Pagination pageCount={Math.ceil(data.totalCount / 10)} activePage={Number(router.query.page) || 1} />
            </div>
          ) : isLoading ? (
            <ShowProductsSkeleton />
          ) : (
            <div>
              <ShowProducts data={products!} /> <Pagination pageCount={Math.ceil(products!.totalCount / 10)} activePage={Number(router.query.page) || 1} />
            </div>
          )}
          {/* <ShowProducts data={products!} /> */}
          {/* <Pagination pageCount={Math.ceil(data.totalCount / 10)} activePage={Number(router.query.page) || 1} /> */}
        </div>
      </div>
    </>
  );
};

export default ProductCategory;

export const getServerSideProps: GetServerSideProps<ProductCategoryProps> = async (context) => {
  const {
    query: { category, page, sort },
  } = context;
  console.log("GET SERVER SIDE PROPS RUNNING");

  console.log(category);

  try {
    const response = await axios.get("http://localhost:5000/api/v1/products", {
      params: {
        sort,
        page,
        category,
      },
    });

    const data = response.data as ProductCategoryProps["data"];

    return {
      props: {
        data,
      },
    };

    // const data = (await response.json()) as ProductCategoryProps["data"];
  } catch (err) {
    return {
      props: {
        data: {
          success: false,
          products: null,
          count: 0,
          totalCount: 0,
        },
      },
    };
  }
};
