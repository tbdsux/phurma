import { Deta } from "deta";

export const deta = Deta();
export const projectBase = deta.Base("Projects");

export const getProjectBase = (id: string) => {
  return deta.Base(`proj_${id}`);
};
