import useGetForm from "../forms/useGetForm";
import { useProject } from "../projects/context";

const ResponsesContainer = () => {
  const { project, selectedForm } = useProject();
  const responses = useGetForm(project?.key, selectedForm?.key);

  return (
    <div className="mt-6">
      {project && selectedForm ? (
        <div>{JSON.stringify(responses)}</div>
      ) : (
        <p className="text-sm text-gray-600">
          Select a form to view the responses....
        </p>
      )}
    </div>
  );
};

export default ResponsesContainer;
