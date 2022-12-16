import {
  createContext, ReactNode, useContext
} from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";
import { APIResponse } from "../../typings/api";
import { FormProps } from "../forms/types";
import { ProjectProps } from "./types";

export interface ProjectsContextProps {
  project: ProjectProps | undefined;
  forms?: FormProps[];
 
}

export const ProjectsContext = createContext<ProjectsContextProps>({
  project: undefined,
 
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


  return (
    <ProjectsContext.Provider
      value={{
        project,
        forms: data?.data
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
