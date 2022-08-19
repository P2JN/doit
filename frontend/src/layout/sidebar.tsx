import { AppAssistant } from "components/organisms";
import { useActiveUser } from "store";

const AppSidebar = () => {
  const isLoggedIn = !!useActiveUser().activeUser;

  return (
    <aside className="z-30 order-first rounded-b-xl p-2 shadow-lg md:order-last md:h-screen md:w-1/3 md:border-t-0 md:pb-5 md:pt-[105px] md:shadow-none xl:w-1/5">
      {isLoggedIn && <AppAssistant />}
    </aside>
  );
};

export default AppSidebar;
