import { createContext, ReactNode, useContext } from "react";
import { ProjectProps } from "./types";

export interface ProjectsContextProps {
  project: ProjectProps | undefined;
}

export const ProjectsContext = createContext<ProjectsContextProps>({
  project: undefined,
});

export interface ProjectsProviderProps {
  children: ReactNode;
  project: ProjectProps | undefined;
}

const ProjectsProvider = ({ project, children }: ProjectsProviderProps) => {
  return (
    <ProjectsContext.Provider value={{ project }}>
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
