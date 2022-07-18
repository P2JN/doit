import { ReactNode } from "react";

const Card = (props: { children: ReactNode }) => {
  return (
    <article className="flex flex-col gap-3 overflow-hidden rounded-lg bg-white px-6 py-4 shadow-lg">
      {props.children}
    </article>
  );
};

export default Card;
