import { parseAsInteger, parseAsString } from "nuqs/server";
import { PAGINATION } from "@/config/constants";

export const workflowsParams = {
  page: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE)
    .withOptions({
      shallow: false,
      clearOnDefault: true,
    }),
  search: parseAsString
    .withDefault("")
    .withOptions({
      shallow: false,
      clearOnDefault: true,
    }),
};
