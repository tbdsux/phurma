import useGetForm from "../forms/useGetForm";
import { useProject } from "../projects/context";
import ListResponse from "./list-response";

const ResponsesContainer = () => {
  const { project, selectedForm } = useProject();
  const responses = useGetForm(project?.key, selectedForm?.key);

  return (
    <div className="mt-6">
      {project && selectedForm ? (
        <div>
          <p className="text-right text-sm text-gray-700">{selectedForm.url}</p>

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

export default ResponsesContainer;
