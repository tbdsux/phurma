import { FormProps } from "../forms/types";

export interface ProjectProps {
  name: string;
  key?: string; // auto-added from api by deta
  created_at: number; // for data sorting
  forms: FormProps[];
}
