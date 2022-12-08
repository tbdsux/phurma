import FormDelete from "./form-delete";
import FormSettings from "./form-settings";
import FormsMenu from "./forms-menu";
import NewForm from "./new-form";

const FormActions = () => {
  return (
    <div className="inline-flex flex-wrap items-center justify-between">
      <FormsMenu />
      <FormSettings />
      <FormDelete />
      <NewForm />
    </div>
  );
};

export default FormActions;
