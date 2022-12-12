import { NoSymbolIcon } from "@heroicons/react/20/solid";
import { NextSeo } from "next-seo";
import CustomLayout from "../../layouts/custom";

const FilesNotAllowedPage = () => {
  return (
    <CustomLayout>
      <NextSeo title="Files not allowed" />

      <div className="text-center">
        <NoSymbolIcon
          aria-hidden="true"
          className="mx-auto h-10 w-10 text-red-500"
        />

        <h3 className="text-2xl font-extrabold text-red-500">
          Files not allowed.
        </h3>
        <p className="text-lg text-gray-700">
          Files are not allowed to be submitted in to this form.
        </p>
      </div>
    </CustomLayout>
  );
};

export default FilesNotAllowedPage;
