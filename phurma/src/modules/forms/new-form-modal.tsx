import { Dialog } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import BaseModal from "../../components/Modal";
import { useProject } from "../projects/context";

export interface NewFormModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const NewFormModal = ({ isOpen, closeModal }: NewFormModalProps) => {
  const { project, forms } = useProject();

  const [creating, setCreating] = useState(false);
  const inputFormName = useRef<HTMLInputElement>(null);

  const createForm = async () => {
    if (!inputFormName.current) return;

    const name = inputFormName.current.value ?? "";
    if (name == "") {
      toast.warn("Missing form name in input.");
      return;
    }

    // check if form name already exists
    const c = forms?.filter((f) => f.name === name);
    if (c && c.length > 0) {
      toast.error(`Form with name: ${name} already exists.`);
      return;
    }

    setCreating(true);

    const r = await fetch(`/api/forms/${project?.key}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data = await r.json();
    setCreating(false);

    if (!r.ok) {
      inputFormName.current.value = "";
      toast.error(data.message);
      return;
    }

    toast.success("Successfully created new form.");
    inputFormName.current.value = "";
    mutate(`/api/forms/${project?.key}`);

    closeModal();
  };

  return (
    <BaseModal
      open={isOpen}
      closeModal={closeModal}
      className="max-w-xl rounded-xl bg-white p-8 text-left"
    >
      <Dialog.Title className="text-xl font-extrabold text-rose-500">
        Create New Form
      </Dialog.Title>
      <Dialog.Description className="text-gray-600">
        Create forms which you will use to send messages / data to.
      </Dialog.Description>

      <Dialog.Panel className="mx-auto mt-3 w-11/12">
        <div className="my-2 flex flex-col">
          <label htmlFor="name" className="text-sm text-gray-700">
            Form Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="rounded-xl border py-2 px-4 text-sm"
            placeholder="The form in my project"
            ref={inputFormName}
          />
        </div>
        <div className="my-2 text-right">
          <button
            disabled={creating}
            onClick={createForm}
            className="inline-flex items-center rounded-xl bg-rose-400 py-2 px-8 font-medium text-white duration-300 hover:bg-rose-500 disabled:opacity-80 disabled:hover:bg-rose-400"
          >
            <PlusCircleIcon className="mr-1 h-4 w-4" aria-hidden="true" />
            <small className="uppercase">
              {creating ? "Creating..." : "Create"}
            </small>
          </button>
        </div>
      </Dialog.Panel>
    </BaseModal>
  );
};

export default NewFormModal;
