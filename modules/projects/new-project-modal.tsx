import { Dialog } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import BaseModal from "../../components/Modal";

export interface NewProjectModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const NewProjectModal = ({ isOpen, closeModal }: NewProjectModalProps) => {
  return (
    <BaseModal
      open={isOpen}
      closeModal={closeModal}
      className="max-w-xl rounded-xl bg-white p-8 text-left"
    >
      <Dialog.Title className="text-xl font-extrabold text-rose-500">
        Create New Project
      </Dialog.Title>
      <Dialog.Description className="text-gray-600">
        Group forms by creating a project
      </Dialog.Description>

      <Dialog.Panel className="mx-auto mt-6 w-11/12">
        <div className="my-2 flex flex-col">
          <label htmlFor="name" className="text-gray-700">
            Project Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="rounded-xl border py-2 px-4"
            placeholder="My amazing project"
          />
        </div>
        <div className="my-2 text-right">
          <button className="inline-flex items-center rounded-xl bg-rose-400 py-3 px-8 font-medium text-white duration-300 hover:bg-rose-500">
            <PlusCircleIcon className="mr-1 h-4 w-4" aria-hidden="true" />
            <small className="uppercase">Create</small>
          </button>
        </div>
      </Dialog.Panel>
    </BaseModal>
  );
};

export default NewProjectModal;
