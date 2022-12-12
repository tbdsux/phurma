import { ReactNode } from "react";

export interface CustomLayout {
  children: ReactNode;
}

const CustomLayout = ({ children }: CustomLayout) => {
  return (
    <div className="mx-auto flex min-h-screen w-5/6 items-center justify-center py-24">
      {children}
    </div>
  );
};

export default CustomLayout;
