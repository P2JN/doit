import { ReactNode } from "react";
import { Typography } from "@mui/material";

const Page = (props: {
  title?: string;
  children?: ReactNode;
  actions?: ReactNode;
}) => {
  return (
    <main className="h-[calc(100vh-65px)] w-full overflow-auto px-5 pb-10 pt-3 md:h-screen xl:mx-4">
      <section className="block animate-fade-in">
        <section className="mb-2 flex flex-col justify-between gap-y-2 md:mb-7 md:flex-row md:items-center">
          {props.title && (
            <Typography
              variant="h3"
              className="overflow-hidden text-ellipsis text-center md:text-left"
            >
              {props.title}
            </Typography>
          )}
        </section>
        <section>{props.children}</section>
      </section>
    </main>
  );
};

export default Page;
