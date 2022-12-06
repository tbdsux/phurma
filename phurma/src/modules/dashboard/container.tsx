import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";
import { APIResponse } from "../../typings/api";
import { ProjectProps } from "../projects/types";

const ProjectsContainer = () => {
  const { data } = useSWR<APIResponse<ProjectProps[]>>(
    "/api/projects",
    fetcher
  );

  return (
    <div className="grid grid-cols-4 gap-12">
      {data?.data
        ?.sort((x, y) => y.created_at - x.created_at)
        .map((p) => (
          <Link
            href={`/p/${p.key}`}
            key={p.key}
            className="rounded-xl bg-rose-400 py-8 px-6 text-white duration-300 hover:bg-rose-500"
          >
            <strong>{p.name}</strong>
          </Link>
        ))}
    </div>
  );
};

export default ProjectsContainer;
