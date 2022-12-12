import { NextSeo } from "next-seo";
import Image from "next/image";
import CustomLayout from "../../layouts/custom";
import { LogoIcon } from "../../lib/assets";

const ThankYouPage = () => {
  return (
    <CustomLayout>
      <NextSeo title="Submit successful" />

      <div className="text-left">
        <span className="inline-flex items-center">
          <Image
            src={LogoIcon}
            height={40}
            width={40}
            alt="Phurma"
            className="object-contain"
          />
          <strong className="ml-2 text-lg font-extrabold text-rose-500">
            phurma
          </strong>
        </span>

        <div className="mt-12">
          <h3 className="text-2xl font-extrabold text-rose-500">
            Form submit successful.
          </h3>
          <p className="text-lg text-gray-700">
            You have successfully submitted the form.
          </p>
        </div>
      </div>
    </CustomLayout>
  );
};

export default ThankYouPage;
