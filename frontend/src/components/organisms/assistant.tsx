import { Assistant, ExpandLess, ExpandMore } from "@mui/icons-material";
import { Alert, Skeleton, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { assistantService } from "services";
import { utilsHooks } from "utils";

const AppAssistant = () => {
  const location = useLocation();
  const view = useMemo(() => location.pathname || "", [location]);

  const [collapsed, setCollapsed] = useState(false);

  const {
    data: assistantMessage,
    isLoading: loadingMessage,
    refetch: refetchMessage,
  } = assistantService.useAssistantMessage(view);

  const debouncedRefetch = utilsHooks.useDebouncedCallback(
    refetchMessage,
    20000
  );

  useEffect(() => {
    debouncedRefetch();
  }, [assistantMessage, debouncedRefetch]);

  return (
    <>
      <section
        className="flex items-center justify-end gap-3 !text-primary md:mb-3"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="mr-auto md:hidden">
          {collapsed ? <ExpandMore scale={2} /> : <ExpandLess scale={2} />}
        </div>
        <Typography variant="h6" className="!font-bold">
          Asistente
        </Typography>
        <Assistant />
      </section>
      <section
        key={collapsed ? "collapsed" : "expanded"}
        className={
          "flex w-full flex-col gap-3 transition-all duration-200 ease-in-out " +
          (collapsed ? "h-0 overflow-hidden" : "mt-3 h-auto md:mt-0")
        }
      >
        {!loadingMessage ? (
          <Alert
            severity="success"
            variant="outlined"
            icon={false}
            className="w-full"
          >
            <Typography variant="body1" className="animate-fade-in">
              {assistantMessage?.message || "Estoy aquí para ayudarte"}
            </Typography>
          </Alert>
        ) : (
          <div className="w-full rounded border p-3">
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
          </div>
        )}
      </section>
    </>
  );
};

export default AppAssistant;
