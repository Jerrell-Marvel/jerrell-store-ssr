import { GetServerSideProps, NextPage } from "next";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import Pagination from "../../components/Pagination/Pagination";
import ShowProducts from "../../components/ShowProducts/ShowProducts";

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
  return (
    <>
      <div className="bg-slate-100 px-6 py-10">
        <ShowProducts data={data} />
        <Pagination pageCount={data.totalCount} />
      </div>
    </>
  );
};

export default ProductCategory;

export const getServerSideProps: GetServerSideProps<ProductCategoryProps> = async (context) => {
  const {
    query: { category },
  } = context;
  console.log(context.query);

  let response;

  try {
    if (category === "all") {
      response = await fetch(`http://localhost:5000/api/v1/products`);
    } else {
      response = await fetch(`http://localhost:5000/api/v1/products?category=${category}`);
    }
    const data = (await response.json()) as ProductCategoryProps["data"];
    return {
      props: {
        data,
      },
    };
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
