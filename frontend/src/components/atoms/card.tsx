import { ReactNode } from "react";

const Card = (props: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <article
      className={
        "flex h-min flex-col gap-3 overflow-hidden rounded-lg bg-white px-6 py-5 shadow-card   hover:shadow-card-hover" +
        (props.className ? " " + props.className : "")
      }
      onClick={props.onClick}
    >
      {props.children}
    </article>
  );
};

export default Card;
