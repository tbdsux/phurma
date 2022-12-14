import { CheckIcon, ClipboardDocumentIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useForms } from "./context";

const CopyForm = () => {
  const { form } = useForms();

  const [copied, setCopied] = useState(false);

  const copyFormUrl = () => {
    setCopied(true);
    navigator.clipboard.writeText(form?.url ?? "");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="m-1">
      <div className="inline-flex items-center">
        <p className="text-sm text-gray-700">{form?.url}</p>

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
