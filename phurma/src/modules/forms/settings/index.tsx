import FormDelete from "./form-delete";
import UpdateFormMisc from "./update-form-misc";
import UpdateFormName from "./update-form-name";

const FormSettings = () => {
  return (
    <div className="mt-8 md:mx-8">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xl font-bold text-gray-800">Settings</h4>
          <p className="text-gray-600">Configure settings for your form.</p>
        </div>

        <FormDelete />
      </div>

      <hr className="my-2" />

      <div className="mx-auto mt-4 w-11/12">
        <div className="">
          <strong>Main Settings</strong>

          <UpdateFormName />
        </div>

        <hr className="my-8" />

        <div className="">
          <strong>Miscellaneous Settings</strong>

          <UpdateFormMisc />
        </div>
      </div>
    </div>
  );
};

export default FormSettings;
