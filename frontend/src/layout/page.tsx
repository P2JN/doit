import { ReactNode } from "react";
import { Typography } from "@mui/material";

const Page = (props: {
  title?: string;
  children?: ReactNode;
  actions?: ReactNode;
}) => {
  return (
    <main className="h-[calc(100vh-65px)] w-full overflow-auto px-4 py-3 md:h-screen">
      <section className="animate-fade-in block md:w-3/4">
        <section className="flex flex-col justify-between gap-y-2 md:flex-row md:items-center">
          {props.title && (
            <Typography variant="h3" className="overflow-hidden text-ellipsis">
              {props.title}
            </Typography>
          )}
        </section>
        <section>{props.children}</section>
      </section>
      <aside className="w-1/4">
        {props.actions && (
          <div className="flex items-center gap-2 md:justify-end">
            {props.actions}
          </div>
        )}
      </aside>
    </main>
  );
};

export default Page;
