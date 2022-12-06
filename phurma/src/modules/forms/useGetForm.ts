import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";
import { APIResponse } from "../../typings/api";
import { ResponsesProps } from "../responses/types";

const useGetForm = (projectKey?: string, formId?: string) => {
  const { data } = useSWR<APIResponse<ResponsesProps>>(
    projectKey && formId ? `/api/forms/${projectKey}/${formId}` : null,
    fetcher
  );

  return data?.data;
};

export default useGetForm;
