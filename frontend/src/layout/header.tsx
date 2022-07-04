import { useNavigate } from "react-router";
import { Person, PowerSettingsNew } from "@mui/icons-material";

import LogoAndName from "assets/LogoAndName.svg";

const AppHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-brand fixed top-0 z-50 flex w-full items-center justify-between gap-5 rounded-b-xl px-4 py-3 md:px-8 lg:px-24 xl:px-48">
      <a href="/landing" className="flex items-center justify-start gap-5">
        <img src={LogoAndName} alt="React Logo" className="h-6" />
        <span className="hidden font-bold md:block">Doit</span>
      </a>
      <div className="flex gap-3">
        <Person
          className="cursor-pointer text-white"
          onClick={() => navigate("/profile")}
        />
        <PowerSettingsNew className="cursor-pointer text-white" />
      </div>
    </header>
  );
};

export default AppHeader;
