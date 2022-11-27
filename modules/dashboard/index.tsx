import { NextSeo } from "next-seo";
import DashboardLayout from "../../layouts/dashboard";
import NewProject from "../projects/new-project";
import ProjectsContainer from "./container";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <NextSeo title="Dashboard" />

      <div className="mt-6 flex items-center justify-between">
        <strong className="text-gray-600">All projects</strong>

        <NewProject />
      </div>

      <div className="mt-12">
        <ProjectsContainer />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
