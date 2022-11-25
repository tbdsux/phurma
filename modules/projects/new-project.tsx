import { PlusCircleIcon } from "@heroicons/react/20/solid";

const NewProject = () => {
  return (
    <>
      <button className="inline-flex items-center rounded-xl bg-indigo-400 py-2 px-8 text-white duration-300 hover:bg-indigo-500">
        <PlusCircleIcon className="mr-1 h-4 w-4" aria-hidden="true" />

        <small className="font-medium">New Project</small>
      </button>
    </>
  );
};

export default NewProject;
