import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Alert,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Feed, Info, Timeline, TrackChanges } from "@mui/icons-material";

import { SocialTypes } from "types";
import { Page } from "layout";
import { socialService } from "services";

import {
  UserFeedTab,
  UserInfoTab,
  UserStatsTab,
  UserTrackingsTab,
} from "components/templates";
import { UserTeaserInfo } from "components/organisms";

type UserTabsType = "info" | "feed" | "trackings" | "leaderboard" | "stats";

const UserDetailPage = () => {
  const { userId, activeTab } = useParams();

  const {
    data: user,
    isLoading: loadingUser,
    refetch,
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
    feed: "Feed",
    trackings: "Mis registros",
    leaderboard: "Leaderboard",
    stats: "Estadísticas",
  };

  return (
    <Page
      title={user ? user.firstName + " " + user.lastName : "Usuario sin nombre"}
    >
      <div className="flex flex-col gap-3">
        {user && <UserTeaserInfo {...user} />}
        <div className="mt-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <Typography variant="h5">
            {labels[activeTab as UserTabsType]}
          </Typography>

          <Tabs
            value={activeTab}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
          >
            <Tab value={"info"} icon={<Info />} />
            <Tab value={"feed"} icon={<Feed />} />
            <Tab value={"trackings"} icon={<TrackChanges />} />
            <Tab value={"stats"} icon={<Timeline />} />
          </Tabs>
        </div>
        {loadingUser && <CircularProgress />}
        {!loadingUser && !user && (
          <Alert
            severity="info"
            className="my-7"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Reintentar
              </Button>
            }
          >
            No se ha encontrado el usuario
          </Alert>
        )}
        {activeTab && user && <UserTabs activeTab={activeTab} user={user} />}
      </div>
    </Page>
  );
};

export default UserDetailPage;

const UserTabs = (props: { activeTab: string; user: SocialTypes.User }) => {
  const { activeTab, user } = props;
  return (
    <section>
      {activeTab === "info" && <UserInfoTab {...user} />}
      {activeTab === "feed" && <UserFeedTab />}
      {activeTab === "trackings" && <UserTrackingsTab />}
      {activeTab === "stats" && <UserStatsTab />}
    </section>
  );
};
