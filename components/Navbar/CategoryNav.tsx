import Link from "next/link";
import { useRouter } from "next/router";

const categoryLinks = ["all", "hoodie", "snacks", "jeans", "shorts", "shirts"];
const CategoryNav = () => {
  const router = useRouter();

  return (
    <>
      <div className="relative flex h-[40vh] w-full items-center justify-center bg-[url('https://source.unsplash.com/random/800x300')] bg-cover px-6 text-center after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:bg-slate-800 after:opacity-40 after:content-[''] mt-20">
        <h2 className="z-[2] text-5xl font-medium text-white sm:leading-[6rem]">Explore Products</h2>
      </div>
      <div className="sticky top-20 z-[50] bg-white">
        <ul className="flex h-16 items-center justify-between gap-8 overflow-auto border-b-2 bg-white px-6 lg:justify-evenly">
          {categoryLinks.map((categoryLink, index) => {
            return (
              <li className="h-full" key={index}>
                <Link href={`/product-category/${categoryLink}`} className="group flex h-full items-center">
                  <a className={`group flex h-full items-center ${categoryLink === router.query.category ? "active" : ""}`}>
                    <span className="relative w-fit font-medium uppercase after:absolute after:-bottom-1/4 after:left-1/2 after:block after:h-[3px]  after:w-0 after:bg-slate-800 after:transition-all after:duration-300 after:content-[''] group-hover:after:left-0 group-hover:after:right-0 group-hover:after:w-full">
                      {categoryLink}
                    </span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default CategoryNav;
