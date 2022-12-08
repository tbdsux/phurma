import { Dialog } from "@headlessui/react";
import { Cog6ToothIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import BaseModal from "../../components/Modal";
import useOpen from "../../hooks/useOpen";
import { APIResponse } from "../../typings/api";
import { ProjectProps } from "./types";

interface ModifyProjectProps {
  project: ProjectProps;
}

const ModifyProject = ({ project }: ModifyProjectProps) => {
  const { open, close, isOpen } = useOpen();

  const [updating, setUpdating] = useState(false);
  const inputProjectName = useRef<HTMLInputElement>(null);

  const modifyProject = async () => {
    if (!inputProjectName.current) return;

    const name = inputProjectName.current.value ?? "";
    if (name == "") {
      toast.warn("Missing project name in input.");
      return;
    }

    setUpdating(true);

    const r = await fetch(`/api/projects/${project.key}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data: APIResponse<ProjectProps> = await r.json();
    setUpdating(false);

    if (!r.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Successfully modified project.");
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
          Modify Project
        </Dialog.Title>
        <Dialog.Description className="text-gray-600">
          Modify the project{" "}
          <span className="5 rounded-md bg-gray-200 py-0 px-1">
            {project.name}
          </span>{" "}
          to a new name
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
              ref={inputProjectName}
              defaultValue={project.name}
            />
          </div>

          <div className="my-2 text-right">
            <button
              onClick={modifyProject}
              disabled={updating}
              className="inline-flex items-center rounded-xl bg-rose-400 py-3 px-8 font-medium text-white duration-300 hover:bg-rose-500 disabled:opacity-80 disabled:hover:bg-rose-400"
            >
              <PencilSquareIcon className="mr-1 h-4 w-4" aria-hidden="true" />
              <small className="uppercase">
                {updating ? "Updating..." : "Update"}
              </small>
            </button>
          </div>
        </Dialog.Panel>
      </BaseModal>

      <button
        title="Modify Project"
        onClick={open}
        className="m-1 flex w-full items-center rounded-md bg-gray-100 p-1 text-sm text-gray-600 duration-300 hover:bg-gray-200"
      >
        <Cog6ToothIcon aria-hidden="true" className="h-4 w-4" />
      </button>
    </>
  );
};

export default ModifyProject;
