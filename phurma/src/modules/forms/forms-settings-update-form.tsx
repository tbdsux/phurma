import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { useProject } from "../projects/context";

const FormSettingsUpdateForm = () => {
  const { project, selectedForm, setSelectedForm } = useProject();

  const [updating, setUpdating] = useState(false);
  const inputNameRef = useRef<HTMLInputElement>(null);

  const saveForm = async () => {
    if (!selectedForm || !project) return;

    const newName = inputNameRef.current?.value.trim() ?? "";
    if (newName === "" || newName === selectedForm.name) {
      // nothing to change
      return;
    }

    setUpdating(true);

    const r = await fetch(`/api/forms/${project.key}/${selectedForm.key}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name: newName }),
    });

    const data = await r.json();
    setUpdating(false);

    if (!r.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Successfully updated form name.");
    mutate(`/api/forms/${project.key}`);
    setSelectedForm(null);
  };

  return (
    <div>
      <div className="my-2 flex flex-col">
        <label htmlFor="name" className="text-sm text-gray-700">
          Form Name
        </label>
        <div className="flex items-center">
          <input
            type="text"
            name="name"
            id="name"
            className="w-full rounded-xl border py-2 px-4 text-sm"
            placeholder="The form in my project"
            defaultValue={selectedForm?.name}
            ref={inputNameRef}
          />
          <button
            onClick={saveForm}
            disabled={updating}
            className="ml-2 inline-flex items-center rounded-xl bg-rose-400 py-2 px-8 font-medium text-white duration-300 hover:bg-rose-500 disabled:opacity-80 disabled:hover:bg-rose-400 "
          >
            <PencilSquareIcon className="mr-1 h-4 w-4" aria-hidden="true" />
            <small className="uppercase">
              {updating ? "Saving..." : "Save"}
            </small>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormSettingsUpdateForm;
