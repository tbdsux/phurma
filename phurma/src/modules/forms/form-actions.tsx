import FormsMenu from "./forms-menu";
import NewForm from "./new-form";

const FormActions = () => {
  return (
    <div className="flex w-full flex-wrap items-center justify-between md:inline-flex md:w-auto">
      <FormsMenu />
      <NewForm />
    </div>
  );
};

export default FormActions;
