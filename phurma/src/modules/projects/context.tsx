import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";
import { APIResponse } from "../../typings/api";
import { FormProps } from "../forms/types";
import { ProjectProps } from "./types";

export interface ProjectsContextProps {
  project: ProjectProps | undefined;
  forms?: FormProps[];
  selectedForm: string | null;
  setSelectedForm: Dispatch<SetStateAction<string | null>>;
  form: FormProps | null;
  setForm: Dispatch<SetStateAction<FormProps | null>>;
}

export const ProjectsContext = createContext<ProjectsContextProps>({
  project: undefined,
  selectedForm: null,
  setSelectedForm: () => {},
  form: null,
  setForm: () => {},
});

export interface ProjectsProviderProps {
  children: ReactNode;
  project: ProjectProps | undefined;
}

const ProjectsProvider = ({ project, children }: ProjectsProviderProps) => {
  const { data } = useSWR<APIResponse<FormProps[]>>(
    project ? `/api/forms/${project.key}` : undefined,
    fetcher
  );
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [form, setForm] = useState<FormProps | null>(null);

  useEffect(() => {
    console.log("set");
    setForm(
      (selectedForm
        ? data?.data?.filter((f) => f.key == selectedForm)[0]
        : null) ?? null
    );
  }, [data?.data, selectedForm]);

  return (
    <ProjectsContext.Provider
      value={{
        project,
        selectedForm,
        setSelectedForm,
        forms: data?.data,
        form,
        setForm,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("<ProjectsProvider></ProjectsProvider>");
  }

  return context;
};

export default ProjectsProvider;
