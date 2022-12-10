import { Switch } from "@headlessui/react";
import { Cog8ToothIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

const FormSettingsUpdateCallback = () => {
  const [allowFiles, setAllowFiles] = useState(true);

  const [updating, setUpdating] = useState(false);

  return (
    <div>
      <strong className="text-gray-600">Miscellaneous Settings</strong>

      <div className="my-3 flex flex-col">
        <label htmlFor="callback" className="text-sm text-gray-700">
          Form submit redirect or callback url (If empty, will redirect to
          default response)
        </label>
        <input
          type="text"
          name="callback"
          id="callback"
          className="rounded-xl border py-2 px-4 text-sm"
          placeholder="Redirect / callback url"
        />
      </div>

      <div className="my-3 flex flex-col">
        <label htmlFor="allow-files" className="text-sm text-gray-700">
          Allow Files (Accept files from your form submissions)
        </label>
        <Switch
          checked={allowFiles}
          onChange={setAllowFiles}
          className={`${allowFiles ? "bg-rose-500" : "bg-rose-300"}
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span className="sr-only">Allow Files</span>
          <span
            aria-hidden="true"
            className={`${allowFiles ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      </div>

      <div className="my-2 text-right">
        <button
          disabled={updating}
          className="inline-flex items-center rounded-xl bg-rose-400 py-2 px-8 font-medium text-white duration-300 hover:bg-rose-500 disabled:opacity-80 disabled:hover:bg-rose-400"
        >
          <Cog8ToothIcon className="mr-1 h-4 w-4" aria-hidden="true" />
          <small className="uppercase">
            {updating ? "Updating..." : "Update"}
          </small>
        </button>
      </div>
    </div>
  );
};

export default FormSettingsUpdateCallback;
