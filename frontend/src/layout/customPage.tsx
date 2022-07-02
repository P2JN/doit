import { ReactNode } from "react";

const CustomPage = (props: {
  title?: string;
  children?: ReactNode;
  actions?: ReactNode;
}) => {
  return <main className="absolute inset-0 bg-white">{props.children}</main>;
};

export default CustomPage;
