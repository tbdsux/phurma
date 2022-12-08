import { Cog8ToothIcon } from "@heroicons/react/20/solid";
import useOpen from "../../hooks/useOpen";
import { useProject } from "../projects/context";
import FormSettingsModal from "./form-settings-modal";

const FormSettings = () => {
  const { selectedForm } = useProject();
  const { open, close, isOpen } = useOpen();

  if (!selectedForm) {
    return <></>;
  }

  return (
    <>
      <FormSettingsModal isOpen={isOpen} closeModal={close} />

      <button
        onClick={open}
        title="Settings"
        className="m-1 rounded-lg bg-rose-100 p-2 text-rose-400 duration-300  hover:bg-rose-200"
      >
        <Cog8ToothIcon aria-hidden="true" className="h-4 w-4" />
      </button>
    </>
  );
};

export default FormSettings;
