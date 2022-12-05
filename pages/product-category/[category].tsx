import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import Pagination from "../../components/Pagination/Pagination";
import ShowProducts from "../../components/ShowProducts/ShowProducts";
import axios from "axios";
import SortProductsDropdown from "../../components/Dropdown/SortProductsDropdown";

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
  return (
    <>
      <div className="bg-slate-200 pt-20 pb-8">
        <div className="bg-slate-100 px-6 py-10">
          <SortProductsDropdown />
          <ShowProducts data={data} />
          <Pagination pageCount={Math.ceil(data.totalCount / 10)} activePage={Number(router.query.page) || 1} />
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

  try {
    const response = await axios.get("http://localhost:5000/api/v1/products", {
      params: {
        sort,
        page,
      },
    });

    const data = response.data as ProductCategoryProps["data"];

    console.log("GET SERVER SIDE PROPS RUNNING");
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
