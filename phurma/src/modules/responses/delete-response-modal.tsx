import { Dialog } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import BaseModal from "../../components/Modal";
import { useForms } from "../forms/context";
import { useProject } from "../projects/context";

interface DeleteResponseModalProps {
  isOpen: boolean;
  closeModal: () => void;
  responseId: string;
}

const DeleteResponseModal = ({
  isOpen,
  closeModal,
  responseId,
}: DeleteResponseModalProps) => {
  const { project } = useProject();
  const { selectedForm, form } = useForms();
  const [deleting, setDeleting] = useState(false);

  const deleteResponse = async () => {
    if (!project || !selectedForm || !form) {
      return;
    }

    setDeleting(true);

    const r = await fetch(
      `/api/responses/${project.key}/${form.key}/${responseId}`,
      {
        method: "DELETE",
      }
    );

    const data = await r.json();
    setDeleting(false);

    if (!r.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Successfully removed the response.");
    mutate(`/api/forms/${project.key}/${form.key}`);
  };

  return (
    <BaseModal
      open={isOpen}
      closeModal={closeModal}
      className="max-w-xl rounded-xl bg-white p-8 text-left"
    >
      <Dialog.Title className="text-xl font-extrabold text-rose-500">
        Delete Response
      </Dialog.Title>
      <Dialog.Description className="text-gray-600">
        Are you sure you want to delete this response? <br />
        Everything will be removed including the files uploaded to the drive.
      </Dialog.Description>

      <Dialog.Panel className="mx-auto mt-6 w-11/12 text-right">
        <button
          disabled={deleting}
          onClick={deleteResponse}
          className="inline-flex items-center rounded-xl bg-rose-400 py-3 px-8 font-medium text-white duration-300 hover:bg-rose-500 disabled:opacity-80 disabled:hover:bg-rose-400"
        >
          <PlusCircleIcon className="mr-1 h-4 w-4" aria-hidden="true" />
          <small className="uppercase">
            {deleting ? "Removing..." : "Remove"}
          </small>
        </button>
      </Dialog.Panel>
    </BaseModal>
  );
};

export default DeleteResponseModal;
