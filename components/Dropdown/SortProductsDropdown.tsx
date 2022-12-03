import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

enum SelectValue {
  newest,
  highest,
  lowest,
}

export default function SortProductsDropdown() {
  const selectRef = useRef<HTMLSelectElement>(null!);

  useEffect(() => {
    const sortParam = router.query.sort || "newest";

    // @ts-ignore
    selectRef.current.selectedIndex = SelectValue[sortParam];
  });

  const router = useRouter();
  const path = router.asPath.split("?")[0];
  const { q, sort, page } = router.query;
  return (
    <select
      className="rounded-sm p-2 block mx-auto"
      ref={selectRef}
      onChange={() => {
        const value = selectRef.current.options[selectRef.current.selectedIndex].value;
        router.push(`${path}?${q ? `q=${q}&` : ""}sort=${value}&page=1`);
      }}
    >
      <option value="newest">Newest</option>
      <option value="highest">Highest</option>
      <option value="lowest">Lowest</option>
    </select>
  );
}

// useEffect(() => {
//   const sortParam = searchParams.get("sort") || "newest";

//   // @ts-ignore
//   selectRef.current.selectedIndex = SelectValue[sortParam];
// });
