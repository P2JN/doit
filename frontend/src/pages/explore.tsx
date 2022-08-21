import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, Typography } from "@mui/material";
import {
  CrisisAlert,
  ImageOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";

import { Page } from "layout";

import { SearchBar } from "components/organisms";
import {
  GoalsExploreTab,
  PostsExploreTab,
  UsersExploreTab,
} from "components/templates";

type ExploreTabsType = "posts" | "users" | "goals";

const ExplorePage = () => {
  const { activeTab } = useParams();

  const navigate = useNavigate();

  const labels = {
    posts: "Contenido",
    users: "Usuarios",
    goals: "Metas",
  };

  const handleChange = (_: any, tab: string) => {
    navigate(`/explore/${tab}`);
  };

  useEffect(() => {
    !activeTab && navigate(`/explore/goals`);
  }, [activeTab, navigate]);

  return (
    <Page title="Explora">
      <div className="flex flex-col gap-3">
        <SearchBar />
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <Typography
            variant="h5"
            className="order-2 !text-center md:-order-1 md:text-left"
          >
            {labels[activeTab as ExploreTabsType]}
          </Typography>

          <Tabs
            value={activeTab}
            onChange={handleChange}
            variant="scrollable"
            allowScrollButtonsMobile
          >
            <Tab value={"goals"} icon={<CrisisAlert />} />
            <Tab value={"posts"} icon={<ImageOutlined />} />
            <Tab value={"users"} icon={<PersonOutlineOutlined />} />
          </Tabs>
        </div>
        <div className="flex flex-col gap-10">
          {activeTab === "goals" && <GoalsExploreTab />}
          {activeTab === "users" && <UsersExploreTab />}
          {activeTab === "posts" && <PostsExploreTab />}
        </div>
      </div>
    </Page>
  );
};

export default ExplorePage;
