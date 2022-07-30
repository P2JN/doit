import { ReactNode } from "react";

const Card = (props: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <article
      className={
        "flex flex-col gap-3 overflow-hidden rounded-lg bg-white px-6 py-4 shadow-lg" +
        (props.className ? " " + props.className : "")
      }
      onClick={props.onClick}
    >
      {props.children}
    </article>
  );
};

export default Card;
