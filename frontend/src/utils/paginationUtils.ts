import { InfiniteData } from "react-query";
import { PagedList } from "types/apiTypes";

const paginationUtils = {
  getNextPage: (lastPage: PagedList<any>) =>
    lastPage.next?.split("page=").pop(),

  combinePages: (pageObject?: InfiniteData<PagedList<any>>) =>
    pageObject?.pages?.reduce(
      (acc, page) => acc.concat(page?.results),
      [] as any[]
    ),
};

export default paginationUtils;
