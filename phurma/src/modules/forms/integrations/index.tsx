import DiscordIntegration from "./discord";

const FormIntegrations = () => {
  return (
    <div className="mt-8 md:mx-8">
      <h4 className="text-xl font-bold text-gray-800">Form Integrations</h4>
      <p className="text-gray-600">
        Automate form responses with the following integrations.
      </p>

      <hr className="my-2" />

      <div className="">
        <DiscordIntegration />
      </div>
    </div>
  );
};

export default FormIntegrations;
