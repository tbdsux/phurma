import { Dialog } from "@headlessui/react";
import BaseModal from "../../components/Modal";
import { useProject } from "../projects/context";

interface FormSettingsModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const FormSettingsModal = ({ isOpen, closeModal }: FormSettingsModalProps) => {
  const { selectedForm } = useProject();

  return (
    <BaseModal
      open={isOpen}
      closeModal={closeModal}
      className="max-w-2xl rounded-xl bg-white p-8 text-left"
    >
      <Dialog.Title className="text-xl font-extrabold text-rose-500">
        Manage Form
      </Dialog.Title>
      <Dialog.Description className="text-gray-600">
        Manage the settings and integrations for your form
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
            defaultValue={selectedForm?.name}
          />
        </div>
      </Dialog.Panel>
    </BaseModal>
  );
};

export default FormSettingsModal;
