import { useEffect } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Avatar, Divider, Tab, Tabs, Typography } from "@mui/material";
import {
  ImageOutlined,
  InfoOutlined,
  PersonOutlineOutlined,
  Timeline,
  TrackChanges,
} from "@mui/icons-material";

import { SocialTypes } from "types";
import { Id } from "types/apiTypes";
import { Page } from "layout";
import { socialService } from "services";
import { mediaUtils } from "utils";

import { Loader } from "components/atoms";
import { DataLoader } from "components/molecules";
import { ModalDrawer, UserTeaserInfo } from "components/organisms";
import {
  UserFeedTab,
  UserInfoTab,
  UserStatsTab,
  UserTrackingsTab,
  UserFollowersTab,
  PostForm,
  MediaForm,
  DeleteTrackingConfirmation,
} from "components/templates";

type UserTabsType = "info" | "feed" | "trackings" | "stats" | "related";

const UserDetailPage = () => {
  const { userId, activeTab } = useParams();

  const {
    data: user,
    isLoading: loadingUser,
    refetch,
    error,
  } = socialService.useUser(userId);

  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    refetch();
  }, [userId, refetch, location]);

  const handleChange = (_: any, tab: string) => {
    navigate(`/users/${userId}/${tab}`);
  };

  const labels = {
    info: "Información",
    feed: "Contenido",
    trackings: "Progreso",
    related: "Usuarios relacionados",
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
                <Tab value={"trackings"} icon={<TrackChanges />} />
                <Tab value={"feed"} icon={<ImageOutlined />} />
                <Tab value={"related"} icon={<PersonOutlineOutlined />} />
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
      {user && <UserModals {...user} />}
    </Page>
  );
};

export default UserDetailPage;

const UserTabs = (props: { activeTab: string; user: SocialTypes.User }) => {
  const { activeTab, user } = props;
  return (
    <section>
      {activeTab === "info" && <UserInfoTab {...user} />}
      {activeTab === "trackings" && <UserTrackingsTab {...user} />}
      {activeTab === "feed" && <UserFeedTab {...user} />}
      {activeTab === "related" && <UserFollowersTab {...user} />}
      {activeTab === "stats" && <UserStatsTab {...user} />}
    </section>
  );
};

const UserModals = (user: SocialTypes.User) => {
  const navigate = useNavigate();

  const {
    mutate: updatePhoto,
    isLoading: loadingPhoto,
    error: errorPhoto,
  } = socialService.useUpdateUserPhoto();

  const onUpdatePhoto = (mediaId?: Id) => {
    updatePhoto(
      { userId: user.id, mediaId },
      {
        onSuccess: () => {
          navigate(`/users/${user.id}/info`);
        },
      }
    );
  };

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
      <Route
        path="/update-photo"
        element={
          <ModalDrawer title="Cambia tu foto" onClose={() => navigate(-1)}>
            <div className="mb-10 flex justify-center">
              <Avatar
                alt="userimg"
                src={mediaUtils.sanitizeMediaUrl(user?.urlMedia)}
                className="!h-[65px] !w-[65px] rounded-full border-2 border-gray-300 md:!h-[180px] md:!w-[180px]"
              />
            </div>
            <Divider />
            <MediaForm initial={user.media} onUploadFinished={onUpdatePhoto} />
            {loadingPhoto && <Loader />}
            {errorPhoto && <div>Error</div>}
          </ModalDrawer>
        }
      />
      <Route
        path="/delete-tracking/:trackingId"
        element={
          <ModalDrawer title="Eliminar progreso" onClose={() => navigate(-1)}>
            <DeleteTrackingConfirmation />
          </ModalDrawer>
        }
      />
    </Routes>
  );
};
