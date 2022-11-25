import { NextSeo } from "next-seo";
import DashboardLayout from "../../layouts/dashboard";
import NewProject from "../projects/new-project";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <NextSeo title="Dashboard" />

      <div className="flex items-center justify-between">
        <strong className="text-gray-600">All projects</strong>

        <NewProject />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
