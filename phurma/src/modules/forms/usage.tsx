import { useProject } from "../projects/context";

const FormUsage = () => {
  const { form } = useProject();

  return (
    <div className="mt-8 md:mx-8">
      <h4 className="text-xl font-bold text-gray-800">How to use?</h4>

      <ul className="mt-2 md:mx-8">
        <li className="my-3">
          <p className="text-gray-700">1. Copy your form url</p>
          <pre className="mt-1 w-full overflow-auto rounded-xl bg-rose-100 py-2 px-4 text-sm text-gray-700">
            {form?.url}
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
          <pre className="mt-1 w-full overflow-auto rounded-xl bg-rose-100 py-1 px-4 text-sm text-gray-700">
            {`
<form action="${form?.url}" method="post" enctype="multipart/form-data">
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
            `}
          </pre>
        </li>

        <li className="my-3">
          <p className="text-gray-700">3. View submissions in your dashboard</p>
          <p className="text-gray-700">
            You can now view all of the responses or submissions sent in your
            form.
          </p>
        </li>
      </ul>
    </div>
  );
};

export default FormUsage;
