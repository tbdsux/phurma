import useSWR from "swr";
import { APIResponse } from "../../typings/api";
import { useProject } from "../projects/context";
import { ResponsesProps } from "../responses/types";

const useGetForm = () => {
  const { project, selectedForm } = useProject();

  const { data } = useSWR<APIResponse<ResponsesProps>>(
    project && selectedForm
      ? `/api/projects/${project.key}/${selectedForm.id}`
      : undefined
  );

  return data?.data;
};

export default useGetForm;
