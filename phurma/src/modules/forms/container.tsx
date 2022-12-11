import { useProject } from "../projects/context";
import ListResponse from "../responses/list-response";
import CopyForm from "./copy-form";
import useGetForm from "./useGetForm";

const FormsContainer = () => {
  const { project, form } = useProject();
  const responses = useGetForm(project?.key, form?.key);

  return (
    <div className="mt-6">
      {project && form ? (
        <div>
          <CopyForm />

          {responses ? (
            <ListResponse responses={responses.items} keys={responses.keys} />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-600">
          Select a form to view the responses....
        </p>
      )}
    </div>
  );
};

export default FormsContainer;
