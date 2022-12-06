import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
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
  selectedForm: FormProps | null;
  setSelectedForm: Dispatch<SetStateAction<FormProps | null>>;
}

export const ProjectsContext = createContext<ProjectsContextProps>({
  project: undefined,
  selectedForm: null,
  setSelectedForm: () => {},
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
  const [selectedForm, setSelectedForm] = useState<FormProps | null>(null);

  return (
    <ProjectsContext.Provider
      value={{ project, selectedForm, setSelectedForm, forms: data?.data }}
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
