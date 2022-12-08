import Link from "next/link";
import ModifyProject from "./modify-project";
import RemoveProject from "./remove-project";
import { ProjectProps } from "./types";

interface ListProjectProps {
  project: ProjectProps;
}

const ListProject = ({ project }: ListProjectProps) => {
  return (
    <div className="group relative flex h-full w-full items-center">
      <Link
        href={`/p/${project.key}`}
        className="h-full w-full rounded-xl bg-rose-500 py-8 px-6 text-white opacity-90 duration-300 hover:opacity-100"
      >
        <strong>{project.name}</strong>
      </Link>

      <div className="absolute top-1 right-1 hidden items-center group-hover:inline-flex">
        <ModifyProject project={project} />

        <RemoveProject project={project} />
      </div>

      <div className="absolute top-1 right-1"></div>
    </div>
  );
};

export default ListProject;
