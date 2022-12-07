import { Deta } from "deta";

export const deta = Deta();
export const projectBase = deta.Base("Projects");
export const formsBase = deta.Base("ProjectForms");

export const getFormBase = (form_id: string) => {
  return deta.Base(`form_${form_id}`);
};

export const getFormDrive = (form_id: string) => {
  return deta.Drive(`form_${form_id}`);
};
