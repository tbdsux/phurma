export interface FormProps {
  name: string;
  key: string; // auto added by deta
  created_at: number;
  projectKey: string; // reference to the parent project
  allowFiles: boolean;
  redirectUrl: string;
  url: string;
}

export interface APIFormProps extends FormProps {
  url: string;
}
