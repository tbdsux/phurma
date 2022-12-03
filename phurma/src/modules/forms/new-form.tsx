import { DocumentPlusIcon } from "@heroicons/react/20/solid";
import useOpen from "../../hooks/useOpen";
import NewFormModal from "./new-form-modal";

const NewForm = () => {
  const { isOpen, open, close } = useOpen();

  return (
    <>
      <NewFormModal isOpen={isOpen} closeModal={close} />

      <button
        onClick={open}
        className="inline-flex items-center rounded-xl bg-rose-400 py-2 px-8 text-white duration-300 hover:bg-rose-500"
      >
        <DocumentPlusIcon className="mr-1 h-4 w-4" />
        <small className="font-medium">New Form</small>
      </button>
    </>
  );
};

export default NewForm;
