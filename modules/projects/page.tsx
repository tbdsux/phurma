import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import useSWR from "swr";
import DashboardLayout from "../../layouts/dashboard";
import { APIResponse } from "../../typings/api";
import FormsMenu from "../forms/forms-menu";
import NewForm from "../forms/new-form";
import ProjectsProvider from "./context";
import { ProjectProps } from "./types";

const ProjectPage = () => {
  const router = useRouter();
  const { data } = useSWR<APIResponse<ProjectProps>>(
    `/api/projects/${router.query.id}`
  );

  if (!data) {
    return <></>;
  }

  return (
    <DashboardLayout>
      <ProjectsProvider project={data.data}>
        <NextSeo title={`${data.data?.name} Project - phurma`} />

        <div className="mt-6 flex items-center justify-between">
          <h3 className="text-xl font-extrabold tracking-tight text-rose-500">
            {data.data?.name}
          </h3>

          <div className="inline-flex items-center justify-between">
            <FormsMenu />
            <NewForm />
          </div>
        </div>
      </ProjectsProvider>
    </DashboardLayout>
  );
};

export default ProjectPage;
