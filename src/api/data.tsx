import Api from "@axios/helpers";
import { SEARCH_URL } from "@axios/urls";

export const fetchProduct = async (search: string) =>{
    try {
      if(search == "") return null;
      const request = {
          lcsc:  {
              currentPage: 1,
              pageSize: 10,
              keyword: search
          },
          tgic: {
              q: search,
              full_search: "0",
              limit: 10
          },
          cxt:  {
              q: search
          },
          lkcl: {
              prefix: search,
              condition: ""
          },
          blk: {
              q: search,
              limit: 10
          }
      }
      const response = await Api.postWithJson(SEARCH_URL.all, request, true);
      return response;
    } catch (error) {
      console.log("Error call api: ", error);
    }
}