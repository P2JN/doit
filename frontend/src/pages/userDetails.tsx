import { useEffect } from "react";
import {
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Tab, Tabs, Typography } from "@mui/material";
import {
  ImageOutlined,
  InfoOutlined,
  Timeline,
  TrackChanges,
} from "@mui/icons-material";

import { SocialTypes } from "types";
import { Page } from "layout";
import { socialService } from "services";

import { DataLoader } from "components/molecules";
import { ModalDrawer, UserTeaserInfo } from "components/organisms";
import {
  UserFeedTab,
  UserInfoTab,
  UserStatsTab,
  UserTrackingsTab,
  PostForm,
} from "components/templates";

type UserTabsType = "info" | "feed" | "trackings" | "stats";

const UserDetailPage = () => {
  const { userId, activeTab } = useParams();

  const {
    data: user,
    isLoading: loadingUser,
    refetch,
    error,
  } = socialService.useUser(userId);

  const navigate = useNavigate();

  const [params, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (params.get("refresh") === "user") {
      refetch();
      setSearchParams("");
    }
  }, [userId, params, refetch, setSearchParams]);

  const handleChange = (_: any, tab: string) => {
    navigate(`/users/${userId}/${tab}`);
  };

  const labels = {
    info: "Información",
    feed: "Contenido",
    trackings: "Registros",
    stats: "Estadísticas",
  };

  return (
    <Page title={user ? user.firstName + " " + user.lastName : "404 No existe"}>
      <div className="mt-4 flex flex-col gap-3 md:mt-0">
        {user && (
          <>
            <UserTeaserInfo {...user} />
            <div className="mt-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <Typography
                variant="h5"
                className="order-2 !text-center md:-order-1 md:text-left"
              >
                {labels[activeTab as UserTabsType]}
              </Typography>

              <Tabs
                value={activeTab}
                onChange={handleChange}
                variant="scrollable"
                allowScrollButtonsMobile
              >
                <Tab value={"info"} icon={<InfoOutlined />} />
                <Tab value={"feed"} icon={<ImageOutlined />} />
                <Tab value={"trackings"} icon={<TrackChanges />} />
                <Tab value={"stats"} icon={<Timeline />} />
              </Tabs>
            </div>
          </>
        )}
        <DataLoader
          isLoading={loadingUser}
          hasData={!!user}
          retry={refetch}
          error={error}
        />
        {activeTab && user && <UserTabs activeTab={activeTab} user={user} />}
      </div>
      <UserModals />
    </Page>
  );
};

export default UserDetailPage;

const UserTabs = (props: { activeTab: string; user: SocialTypes.User }) => {
  const { activeTab, user } = props;
  return (
    <section>
      {activeTab === "info" && <UserInfoTab {...user} />}
      {activeTab === "feed" && <UserFeedTab {...user} />}
      {activeTab === "trackings" && <UserTrackingsTab />}
      {activeTab === "stats" && <UserStatsTab />}
    </section>
  );
};

const UserModals = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/new-post"
        element={
          <ModalDrawer title="Nuevo post" onClose={() => navigate(-1)}>
            <PostForm />
          </ModalDrawer>
        }
      />
    </Routes>
  );
};
