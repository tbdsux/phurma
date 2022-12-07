import { TrashIcon } from "@heroicons/react/20/solid";
import useOpen from "../../hooks/useOpen";
import DeleteResponseModal from "./delete-response-modal";

interface DeleteResponseProps {
  responseId: string;
}

const DeleteResponse = ({ responseId }: DeleteResponseProps) => {
  const { open, close, isOpen } = useOpen();

  return (
    <>
      <DeleteResponseModal
        isOpen={isOpen}
        closeModal={close}
        responseId={responseId}
      />

      <button
        onClick={open}
        title="Delete"
        className="inline-flex items-center rounded-md bg-red-400 p-1 text-white duration-300 hover:bg-red-500"
      >
        <TrashIcon aria-hidden="true" className="h-4 w-4" />
      </button>
    </>
  );
};

export default DeleteResponse;
