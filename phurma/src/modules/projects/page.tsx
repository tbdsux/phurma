import { NextSeo } from "next-seo";
import Error from "next/error";
import { useRouter } from "next/router";
import useSWR from "swr";
import DashboardLayout from "../../layouts/dashboard";
import { fetcher } from "../../lib/fetcher";
import { APIResponse } from "../../typings/api";
import FormsContainer from "../forms/container";
import FormsProvider from "../forms/context";
import FormActions from "../forms/form-actions";
import ProjectsProvider from "./context";
import { ProjectProps } from "./types";

interface ProjectPageProps {
  statusCode: number;
  data?: APIResponse<ProjectProps>;
}

const ProjectPage = ({ statusCode, data: projectData }: ProjectPageProps) => {
  const router = useRouter();
  const { id } = router.query;

  const { data } = useSWR<APIResponse<ProjectProps>>(
    id ? `/api/projects/${id}` : null,
    fetcher,
    {
      fallbackData: projectData,
    }
  );

  if (statusCode != 200) {
    return <Error statusCode={statusCode} />;
  }

  if (!data) {
    return <></>;
  }

  return (
    <DashboardLayout>
      <ProjectsProvider project={data.data}>
        <NextSeo title={`${data.data?.name} | Project - phurma`} />

        <FormsProvider>
          <div className="mt-6 flex flex-col items-start justify-between md:flex-row md:items-center">
            <h3 className="text-xl font-extrabold tracking-tight text-rose-500">
              {data.data?.name}
            </h3>

            <FormActions />
          </div>

          <FormsContainer />
        </FormsProvider>
      </ProjectsProvider>
    </DashboardLayout>
  );
};

export default ProjectPage;
