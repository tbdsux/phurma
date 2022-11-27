import { PlusCircleIcon } from "@heroicons/react/20/solid";
import useOpen from "../../hooks/useOpen";
import NewProjectModal from "./new-project-modal";

const NewProject = () => {
  const { isOpen, open, close } = useOpen();

  return (
    <>
      <NewProjectModal isOpen={isOpen} closeModal={close} />

      <button
        onClick={open}
        className="inline-flex items-center rounded-xl bg-rose-400 py-2 px-8 text-white duration-300 hover:bg-rose-500"
      >
        <PlusCircleIcon className="mr-1 h-4 w-4" aria-hidden="true" />

        <small className="font-medium">New Project</small>
      </button>
    </>
  );
};

export default NewProject;
