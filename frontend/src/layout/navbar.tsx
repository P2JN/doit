import { ReactNode } from "react";
import { Link, useMatch } from "react-router-dom";
import {
  ExploreOutlined,
  HomeOutlined,
  ImageOutlined,
  NotificationsOutlined,
  PersonOutlineOutlined,
  PowerSettingsNewOutlined,
} from "@mui/icons-material";
import { Badge, Divider, Icon } from "@mui/material";

import { useActiveUser, useAlertCount } from "store";
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
      (useMatch(props.to + "/*") ? "font-bold text-primary" : "")
    }
    onClick={props.onClick}
  >
    <span className="h-7">{props.icon}</span>
    <span className="hidden md:block">{props.title}</span>
  </Link>
);

const AppNavbar = () => {
  const { activeUser } = useActiveUser();
  const { alertCount } = useAlertCount();
  const { mutate: logout } = socialService.useLogout();

  return (
    <nav
      className={
        "z-20 order-last w-full border-t bg-white md:relative md:order-first md:h-screen md:w-1/3 md:border-t-0 xl:w-1/5 " +
        (!activeUser ? "hidden" : "")
      }
    >
      <aside className="flex items-center justify-between gap-4 px-4 py-3 md:h-full md:flex-col md:items-start md:py-6 md:px-8">
        <Link to="/landing" className="flex items-center justify-start gap-5">
          <Icon>
            <img src={Logo} alt="React Logo" />
          </Icon>
          <span className="hidden md:block">Doit</span>
        </Link>

        <Divider className="hidden md:block" />

        <section className="flex gap-5 sm:gap-8 md:block">
          <NavLink to="/home" icon={<HomeOutlined />} title="Inicio" />
          <NavLink to="/feed" icon={<ImageOutlined />} title="Contenido" />
          <NavLink to="/explore" icon={<ExploreOutlined />} title="Explora" />
          <NavLink
            to="/notifications"
            icon={
              <Badge
                badgeContent={alertCount}
                className="font-bold"
                color="primary"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <NotificationsOutlined />
              </Badge>
            }
            title="Actividad"
          />
        </section>

        <section className="mt-auto flex gap-3 md:block">
          <NavLink
            to={"/users/" + activeUser?.id + "/info"}
            icon={<PersonOutlineOutlined />}
            title={"@" + activeUser?.username}
          />
          <NavLink
            to="/logout"
            icon={<PowerSettingsNewOutlined />}
            title="Log out"
            onClick={() => {
              logout({});
              localStorage.removeItem("token");
            }}
          />
        </section>
      </aside>
    </nav>
  );
};

export default AppNavbar;
