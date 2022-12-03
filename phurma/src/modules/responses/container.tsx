import useGetForm from "../forms/useGetForm";

const ResponsesContainer = () => {
  const responses = useGetForm();

  return <div>{JSON.stringify(responses)}</div>;
};

export default ResponsesContainer;
