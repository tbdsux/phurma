import { ClipboardDocumentIcon } from "@heroicons/react/20/solid";
import { useForms } from "./context";

const generateFormCode = (formUrl: string) => `
<form action="${formUrl}" method="post" enctype="multipart/form-data">
<div>
    <label for="name">Name</label>
    <input type="text" name="name" id="name" />
</div>

<div>
    <label for="age">Age</label>
    <input type="number" name="age" id="age" />
</div>

<div>
    <label for="profile">Profile</label>
    <input type="file" name="profile" id="profile" />
</div>

<button type="submit">submit</button>
</form>
            `;

const FormUsage = () => {
  const { form } = useForms();

  const copyUrl = () => {
    if (!form) return;

    navigator.clipboard.writeText(form.url);
  };

  const copyFormCode = () => {
    if (!form) return;

    navigator.clipboard.writeText(generateFormCode(form.url));
  };

  return (
    <div className="mt-8 md:mx-8">
      <h4 className="text-xl font-bold text-gray-800">How to use?</h4>

      <ul className="mt-2 md:mx-8">
        <li className="my-3">
          <p className="text-gray-700">1. Copy your form url</p>
          <pre className="relative mt-1 w-full overflow-auto rounded-xl bg-rose-100 py-2 px-4 text-sm text-gray-700">
            {form?.url}

            <button
              onClick={copyUrl}
              className="absolute top-2 right-2"
              title="Copy"
            >
              <ClipboardDocumentIcon aria-hidden="true" className="h-4 w-4" />
            </button>
          </pre>
        </li>

        <li className="my-3">
          <p className="text-gray-700">2. Add your url to your html form</p>
          <p className="text-gray-700">
            You need to set the{" "}
            <code className="rounded-xl bg-rose-100 py-0.5 px-1 text-xs text-gray-700 ">
              enctype
            </code>{" "}
            property in your form correctly so that the app knows how to parse
            responses.
          </p>
          <pre className="relative mt-1 w-full overflow-auto rounded-xl bg-rose-100 py-1 px-4 text-sm text-gray-700">
            <button
              onClick={copyFormCode}
              className="absolute top-2 right-2"
              title="Copy"
            >
              <ClipboardDocumentIcon aria-hidden="true" className="h-4 w-4" />
            </button>

            {generateFormCode(form ? form.url : "")}
          </pre>
        </li>

        <li className="my-3">
          <p className="text-gray-700">3. View submissions in your dashboard</p>
          <p className="text-gray-700">
            You can now view all of the responses or submissions sent in the{" "}
            <strong>View Responses</strong> tab.
          </p>
        </li>
      </ul>
    </div>
  );
};

export default FormUsage;
