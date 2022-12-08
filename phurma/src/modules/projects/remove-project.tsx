import { Dialog } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import BaseModal from "../../components/Modal";
import useOpen from "../../hooks/useOpen";
import { ProjectProps } from "./types";

interface RemoveProjectProps {
  project: ProjectProps;
}

const RemoveProject = ({ project }: RemoveProjectProps) => {
  const { open, close, isOpen } = useOpen();

  const [removing, setRemoving] = useState(false);

  const removeProject = async () => {
    setRemoving(true);

    const r = await fetch(`/api/projects/${project.key}`, {
      method: "DELETE",
    });

    const data = await r.json();
    setRemoving(false);
    if (!r.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Successfully removed project.");
    mutate("/api/projects");

    close();
  };

  return (
    <>
      <BaseModal
        open={isOpen}
        closeModal={close}
        className="max-w-xl rounded-xl bg-white p-8 text-left"
      >
        <Dialog.Title className="text-xl font-extrabold text-rose-500">
          Delete Project ?
        </Dialog.Title>
        <Dialog.Description className="text-gray-600">
          Are you sure you want remove project{" "}
          <span className="5 rounded-md bg-gray-200 py-0 px-1">
            {project.name}
          </span>
          ? <br />
          All forms under the project and their responses will be removed and
          gone forever.
        </Dialog.Description>

        <Dialog.Panel className="mx-auto mt-6 w-11/12 text-right">
          <button
            disabled={removing}
            onClick={removeProject}
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
        title="Remove Project"
        onClick={open}
        className="my-1 flex w-full items-center rounded-md bg-red-100 p-1 text-sm text-red-600 duration-300 hover:bg-red-200"
      >
        <TrashIcon aria-hidden="true" className="h-4 w-4" />
      </button>
    </>
  );
};

export default RemoveProject;
