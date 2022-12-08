import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";
import { APIResponse } from "../../typings/api";
import ListProject from "../projects/list-project";
import { ProjectProps } from "../projects/types";

const ProjectsContainer = () => {
  const { data } = useSWR<APIResponse<ProjectProps[]>>(
    "/api/projects",
    fetcher
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-12 2xl:grid-cols-5">
      {data?.data
        ?.sort((x, y) => y.created_at - x.created_at)
        .map((p) => (
          <ListProject key={p.key} project={p} />
        ))}
    </div>
  );
};

export default ProjectsContainer;
