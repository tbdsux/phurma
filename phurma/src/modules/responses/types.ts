export interface ResponseItemFile {
  filename: string;
  file_id: string;
  content_type: string;
}

export interface ResponseItem {
  content: Record<string, any>;
  files: Record<string, ResponseItemFile[]>;
  created_at: number;
  key: string;
}

export interface ResponsesProps {
  formId: string;
  items: ResponseItem[]; // TODO: add type for images and or files
  keys: Record<string, "form" | "file">;
}
