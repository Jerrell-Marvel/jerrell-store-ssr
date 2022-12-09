const ShowProductsSkeleton = () => {
  return (
    <ul className="flex w-full flex-wrap py-10">
      {[...Array(10)].map((element, index) => {
        return (
          <li className="h-96 w-full p-3 sm:w-1/2 md:w-1/3 lg:w-1/4" key={index}>
            <div className="flex h-full w-full flex-col gap-4 rounded-xl bg-white p-4 transition-all duration-300">
              <div className="flex-1 animate-loading bg-slate-200"></div>
              <div className="flex flex-[5] animate-loading items-center justify-center bg-slate-200 px-6 text-center"></div>
              <div className="flex-[2] animate-loading bg-slate-200"></div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ShowProductsSkeleton;
