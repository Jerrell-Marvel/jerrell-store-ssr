import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import SortProductsDropdown from "../components/Dropdown/SortProductsDropdown";
import Pagination from "../components/Pagination/Pagination";
import ShowProducts from "../components/ShowProducts/ShowProducts";

export type SearchProps = {
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

const Search: NextPage<SearchProps> = ({ data }) => {
  const router = useRouter();
  return (
    <div className="bg-slate-200 pt-20 pb-8">
      <div className="bg-slate-100 px-6 py-10">
        <SortProductsDropdown />
        <ShowProducts data={data} />
        <Pagination pageCount={Math.ceil(data.totalCount / 10)} activePage={Number(router.query.page) || 1} />
      </div>
    </div>
  );
};

export default Search;

export const getServerSideProps: GetServerSideProps<SearchProps> = async (context) => {
  const { q, sort, page } = context.query;

  try {
    const response = await axios.get(`http://localhost:5000/api/v1/products/?search=${q}&sort=${sort}=&page=${page}`);
    const data = response.data as SearchProps["data"];
    return {
      props: {
        data,
      },
    };
  } catch (err) {}
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
};
