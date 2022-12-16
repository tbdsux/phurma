import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useProject } from "../projects/context";
import { FormProps } from "./types";

interface FormsContextProps {
  selectedForm: string | null;
  setSelectedForm: Dispatch<SetStateAction<string | null>>;
  form: FormProps | null;
  setForm: Dispatch<SetStateAction<FormProps | null>>;
}

const FormsContext = createContext<FormsContextProps>({
  selectedForm: null,
  setSelectedForm: () => {},
  form: null,
  setForm: () => {},
});

interface FormsProviderProps {
  children: ReactNode;
}

const FormsProvider = ({ children }: FormsProviderProps) => {
  const { forms } = useProject();

  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [form, setForm] = useState<FormProps | null>(null);

  useEffect(() => {
    setForm(
      (selectedForm ? forms?.filter((f) => f.key == selectedForm)[0] : null) ??
        null
    );
  }, [forms, selectedForm]);

  return (
    <FormsContext.Provider
      value={{ selectedForm, setSelectedForm, form, setForm }}
    >
      {children}
    </FormsContext.Provider>
  );
};

export const useForms = () => {
  const context = useContext(FormsContext);
  if (context === undefined) {
    throw new Error("<ProjectsProvider></ProjectsProvider>");
  }

  return context;
};

export default FormsProvider;
