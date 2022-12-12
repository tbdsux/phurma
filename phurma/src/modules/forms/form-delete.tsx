import { Dialog } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import BaseModal from "../../components/Modal";
import useOpen from "../../hooks/useOpen";
import { useProject } from "../projects/context";

const FormDelete = () => {
  const { selectedForm, project, setSelectedForm, form } = useProject();
  const { open, close, isOpen } = useOpen();

  const [removing, setRemoving] = useState(false);

  const removeForm = async () => {
    if (!selectedForm || !project || !form) return;

    setRemoving(true);

    const r = await fetch(`/api/forms/${project.key}/${form.key}`, {
      method: "DELETE",
    });

    const data = await r.json();
    setRemoving(false);
    if (!r.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Successfully removed form.");
    mutate(`/api/forms/${project.key}`);
    setSelectedForm(null);

    close();
  };

  if (!form || !selectedForm) {
    return <></>;
  }

  return (
    <>
      <BaseModal
        open={isOpen}
        closeModal={close}
        className="max-w-xl rounded-xl bg-white p-8 text-left"
      >
        <Dialog.Title className="text-xl font-extrabold text-rose-500">
          Delete Form
        </Dialog.Title>
        <Dialog.Description className="text-gray-600">
          Are you sure you want remove form{" "}
          <span className="5 rounded-md bg-gray-200 py-0 px-1">
            {form.name}
          </span>
          ? <br />
          Everything will be removed including the responses and files under it.
        </Dialog.Description>

        <Dialog.Panel className="mx-auto mt-6 w-11/12 text-right">
          <button
            disabled={removing}
            onClick={removeForm}
            className="inline-flex items-center rounded-xl bg-red-400 py-3 px-8 font-medium text-white duration-300 hover:bg-red-500 disabled:opacity-80 disabled:hover:bg-rose-400"
          >
            <TrashIcon className="mr-1 h-4 w-4" aria-hidden="true" />
            <small className="uppercase">
              {removing ? "Removing..." : "Remove"}
            </small>
          </button>
        </Dialog.Panel>
      </BaseModal>

      <button
        onClick={open}
        title="Delete Form"
        className="m-1 rounded-lg bg-red-400 p-2 text-white duration-300 hover:bg-red-500"
      >
        <TrashIcon aria-hidden="true" className="h-4 w-4" />
      </button>
    </>
  );
};

export default FormDelete;
