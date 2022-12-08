import { CheckIcon, ClipboardDocumentIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useProject } from "../projects/context";

const CopyForm = () => {
  const { selectedForm } = useProject();

  const [copied, setCopied] = useState(false);

  const copyFormUrl = () => {
    setCopied(true);
    navigator.clipboard.writeText(selectedForm?.url ?? "");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="text-right">
      <div className="inline-flex items-center">
        <p className="text-sm text-gray-700">{selectedForm?.url}</p>

        <button
          onClick={copyFormUrl}
          title={copied ? "Copied" : "Copy form url"}
          className="ml-2 rounded-md text-gray-400 duration-300 hover:text-gray-500"
        >
          {copied ? (
            <CheckIcon aria-hidden="true" className="h-4 w-4" />
          ) : (
            <ClipboardDocumentIcon aria-hidden="true" className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CopyForm;
