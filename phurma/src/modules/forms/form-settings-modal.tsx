import { Dialog } from "@headlessui/react";
import BaseModal from "../../components/Modal";
import { useForms } from "./context";
import FormSettingsUpdateCallback from "./form-settings-update-callback";
import FormSettingsUpdateForm from "./forms-settings-update-form";

interface FormSettingsModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const FormSettingsModal = ({ isOpen, closeModal }: FormSettingsModalProps) => {
  const { selectedForm } = useForms();

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
        <FormSettingsUpdateForm />

        <hr className="my-3" />

        <FormSettingsUpdateCallback />
      </Dialog.Panel>
    </BaseModal>
  );
};

export default FormSettingsModal;
