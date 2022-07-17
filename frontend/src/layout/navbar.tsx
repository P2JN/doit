import { ReactNode } from "react";
import { Link, useMatch } from "react-router-dom";
import {
  ContentCopyOutlined,
  ExploreOutlined,
  HomeOutlined,
  NotificationsOutlined,
  PersonOutlineOutlined,
  PowerSettingsNewOutlined,
} from "@mui/icons-material";
import { Divider, Icon } from "@mui/material";

import { socialService } from "services";
import Logo from "assets/Logo.svg";

const NavLink = (props: {
  to: string;
  icon: ReactNode;
  title: string;
  badge?: string;
  onClick?: () => any;
}) => (
  <Link
    to={props.to}
    className={
      "flex items-center justify-start gap-5 hover:text-primary" +
      " " +
      (useMatch(props.to) ? "font-bold text-primary" : "")
    }
    onClick={props.onClick}
  >
    <span className="h-7">{props.icon}</span>
    <span className="hidden md:block">{props.title}</span>
  </Link>
);

const AppNavbar = () => {
  const { mutate: logout } = socialService.useLogout();

  return (
    <nav className="fixed bottom-0 z-20 w-full border-t bg-white md:relative md:h-screen md:w-1/3 md:border-t-0 xl:w-1/5">
      <aside className="flex items-center justify-between gap-5 px-4 py-3 md:h-full md:flex-col md:items-start md:px-8">
        <Link to="/landing" className="flex items-center justify-start gap-5">
          <Icon>
            <img src={Logo} alt="React Logo" />
          </Icon>
          <span className="hidden md:block">Doit</span>
        </Link>

        <Divider className="hidden md:block" />

        <section className="flex gap-5 sm:gap-8 md:block">
          <NavLink to="/home" icon={<HomeOutlined />} title="Home" />
          <NavLink to="/feed" icon={<ContentCopyOutlined />} title="Feed" />
          <NavLink to="/explore" icon={<ExploreOutlined />} title="Explore" />
          <NavLink
            to="/notifications"
            icon={<NotificationsOutlined />}
            title="Alertas"
          />
        </section>

        <section className="mt-auto flex gap-3 md:block">
          <NavLink
            to="/profile"
            icon={<PersonOutlineOutlined />}
            title="Profile"
          />
          <NavLink
            to="/logout"
            icon={<PowerSettingsNewOutlined />}
            title="Log out"
            onClick={() => logout({})}
          />
        </section>
      </aside>
    </nav>
  );
};

export default AppNavbar;
