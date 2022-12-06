import { GetServerSideProps } from "next";
import { join } from "../../lib/utils";
import ProjectPage from "../../modules/projects/page";
import { ProjectProps } from "../../modules/projects/types";
import { APIResponse } from "../../typings/api";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  if (!id) {
    return {
      notFound: true,
    };
  }

  const apiUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api"
      : `https://${process.env.DETA_SPACE_APP_HOSTNAME}/api`;

  const res = await fetch(apiUrl + `/projects/${join(id)}`);

  if (!res.ok) {
    if (res.status === 404) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        statusCode: res.status,
      },
    };
  }

  const data: APIResponse<ProjectProps> = await res.json();

  return {
    props: {
      statusCode: 200,
      data,
    },
  };
};

export default ProjectPage;
