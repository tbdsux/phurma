import { Dialog } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import BaseModal from "../../components/Modal";
import { APIResponse } from "../../typings/api";
import { ProjectProps } from "./types";

export interface NewProjectModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const NewProjectModal = ({ isOpen, closeModal }: NewProjectModalProps) => {
  const router = useRouter();

  const [creating, setCreating] = useState(false);
  const inputProjectName = useRef<HTMLInputElement>(null);

  const createProject = async () => {
    if (!inputProjectName.current) return;

    const name = inputProjectName.current.value ?? "";
    if (name == "") {
      toast.warn("Missing project name in input.");
      return;
    }

    setCreating(true);

    const r = await fetch("/api/projects/create", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data: APIResponse<ProjectProps> = await r.json();
    setCreating(false);

    if (!r.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Successfully created new project");
    router.push(`/p/${data.data?.key}`);
  };

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
            ref={inputProjectName}
          />
        </div>
        <div className="my-2 text-right">
          <button
            onClick={createProject}
            disabled={creating}
            className="inline-flex items-center rounded-xl bg-rose-400 py-3 px-8 font-medium text-white duration-300 hover:bg-rose-500 disabled:opacity-80 disabled:hover:bg-rose-400"
          >
            <PlusCircleIcon className="mr-1 h-4 w-4" aria-hidden="true" />
            <small className="uppercase">
              {creating ? "Creating..." : "Create"}
            </small>
          </button>
        </div>
      </Dialog.Panel>
    </BaseModal>
  );
};

export default NewProjectModal;
