import { useEffect, useMemo, useState } from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { Button, Tab, Tabs, Typography } from "@mui/material";
import {
  CheckCircle,
  Comment,
  CrisisAlert,
  Favorite,
  Image,
  TrackChangesOutlined,
} from "@mui/icons-material";

import { goalService, socialService, statsService } from "services";
import { SocialTypes } from "types";
import { useActiveUser } from "store";
import { paginationUtils } from "utils";

import { Card, HorizontalStatCounters, StatCounter } from "components/atoms";
import { DataLoader } from "components/molecules";
import {
  FollowTable,
  PostTeaserWithoutComments,
  TrackingTeaser,
} from "components/organisms";
import { UserForm } from "components/templates";

const UserInfoTab = (user: SocialTypes.User) => {
  const { activeUser } = useActiveUser();
  const navigate = useNavigate();

  const editUserEnabled = useMatch("/users/:userId/info/edit");

  const isMyProfile = useMemo(
    () => activeUser?.id === user.id,
    [activeUser, user.id]
  );

  return (
    <section className="mb-10 flex animate-fade-in flex-col gap-5">
      <div className="flex justify-between">
        <Typography variant="h5">Datos</Typography>
        {isMyProfile && (
          <Button
            color="primary"
            size="large"
            onClick={() =>
              navigate(
                `/users/${user.id}/info${editUserEnabled ? "" : "/edit"}`
              )
            }
          >
            {editUserEnabled ? "Cerrar" : "Editar"}
          </Button>
        )}
      </div>
      <UserForm initial={user} disabled={!editUserEnabled} />
    </section>
  );
};
const UserFeedTab = (user: SocialTypes.User) => {
  const navigate = useNavigate();

  const { activeUser } = useActiveUser();
  const isMyProfile = useMemo(
    () => activeUser?.id === user.id,
    [activeUser, user.id]
  );

  const {
    data: userPostList,
    isLoading,
    refetch,
    error,
    hasNextPage,
    fetchNextPage,
  } = socialService.useUserPosts(user.id);
  const posts = useMemo(
    () => paginationUtils.combinePages(userPostList),
    [userPostList]
  );

  const location = useLocation();
  useEffect(() => {
    refetch();
  }, [location, refetch]);

  return (
    <section className="animate-fade-in">
      {isMyProfile && (
        <div className="mb-3 flex justify-between">
          <Typography variant="h5">Últimas publicaciones</Typography>
          <Button onClick={() => navigate("new-post")}>Nuevo</Button>
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {posts?.map((post) => (
          <PostTeaserWithoutComments key={post.id} {...post} />
        ))}
      </div>
      <DataLoader
        isLoading={isLoading}
        hasData={!!posts?.length}
        retry={refetch}
        error={error}
        hasNextPage={hasNextPage}
        loadMore={fetchNextPage}
      />
    </section>
  );
};
const UserTrackingsTab = (user: SocialTypes.User) => {
  const {
    data: trackingPages,
    isLoading,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = goalService.useUserTrackings(user.id);
  const trackings = useMemo(
    () => paginationUtils.combinePages(trackingPages),
    [trackingPages]
  );

  return (
    <section className="animate-fade-in">
      <div className="mb-3 flex justify-between">
        <Typography variant="h5">Últimos registros</Typography>
      </div>
      <div className="grid gap-x-5 gap-y-7 md:grid-cols-2 xl:grid-cols-3">
        {trackings?.map((tracking) => (
          <TrackingTeaser key={tracking.id} {...tracking} />
        ))}
      </div>
      <DataLoader
        isLoading={isLoading}
        hasData={!!trackings?.length}
        retry={refetch}
        error={error}
        hasNextPage={hasNextPage}
        loadMore={fetchNextPage}
      />
    </section>
  );
};
const UserStatsTab = (user: SocialTypes.User) => {
  const { data: stats } = statsService.useUserStats(user?.id);

  return (
    <section className="flex flex-col gap-5">
      <section className="flex flex-col gap-3">
        <Card>
          <header>
            <Typography variant="h5">Social</Typography>
          </header>
        </Card>
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <StatCounter
            value={stats?.numPosts}
            label="Publicaciones"
            icon={<Image />}
          />
          <StatCounter
            value={stats?.numComments}
            label="Comentarios recibidos"
            icon={<Comment />}
          />
          <StatCounter
            value={stats?.numLikes}
            label="Likes recibidos"
            icon={<Favorite />}
          />
        </section>
      </section>
      <section className="flex flex-col gap-3">
        <Card>
          <header>
            <Typography variant="h5">Metas</Typography>
          </header>
        </Card>
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <StatCounter
            value={stats?.createdGoals}
            label="Metas creadas"
            icon={<CrisisAlert />}
          />
          <StatCounter
            value={stats?.participatedGoals}
            label="Participaciones"
            icon={<CrisisAlert />}
          />
          <HorizontalStatCounters
            items={[
              {
                label: "Actualmente",
                value: stats?.actuallyParticipatedGoals,
              },
              {
                label: "En metas propias",
                value: stats?.createdGoals,
              },
              {
                label: "En otras metas",
                value:
                  (stats?.participatedGoals || 0) - (stats?.createdGoals || 0),
              },
            ]}
          />
        </section>
      </section>
      <section className="flex flex-col gap-3">
        <Card>
          <header>
            <Typography variant="h5">Progreso</Typography>
          </header>
        </Card>
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <StatCounter
            value={stats?.numTrackings}
            label="Registros"
            icon={<TrackChangesOutlined />}
          />
          <StatCounter
            value={
              (stats?.dailyObjectivesCompleted || 0) +
              (stats?.weeklyObjectivesCompleted || 0) +
              (stats?.monthlyObjectivesCompleted || 0) +
              (stats?.yearlyObjectivesCompleted || 0) +
              (stats?.totalObjectivesCompleted || 0)
            }
            label="Objetivos completados"
            icon={<CheckCircle />}
          />
          <HorizontalStatCounters
            items={[
              {
                label: "diarios",
                value: stats?.dailyObjectivesCompleted,
              },
              {
                value: stats?.weeklyObjectivesCompleted,
                label: "semanales",
              },
              {
                value: stats?.monthlyObjectivesCompleted,
                label: "mensuales",
              },
              {
                value: stats?.yearlyObjectivesCompleted,
                label: "anuales",
              },
              {
                value: stats?.totalObjectivesCompleted,
                label: "totales",
              },
            ]}
          />
        </section>
      </section>
    </section>
  );
};
type FollowersTabType = "followers" | "following";
const UserFollowersTab = (user: SocialTypes.User) => {
  const [subTab, setSubTab] = useState<FollowersTabType>("followers");

  const {
    data: followerPages,
    isLoading,
    refetch,
    error,
    hasNextPage,
    fetchNextPage,
  } = socialService.useFollowers(user.id);
  const followers = useMemo(
    () => paginationUtils.combinePages(followerPages),
    [followerPages]
  );

  const {
    data: followingPages,
    isLoading: isLoadingFollowing,
    error: errorFollowing,
    refetch: refetchFollowing,
    hasNextPage: hasNextPageFollowing,
    fetchNextPage: fetchNextPageFollowing,
  } = socialService.useFollowing(user.id);
  const following = useMemo(
    () => paginationUtils.combinePages(followingPages),
    [followingPages]
  );

  const location = useLocation();
  useEffect(() => {
    refetch();
    refetchFollowing();
  }, [location, refetch, refetchFollowing]);

  return (
    <section className="animate-fade-in">
      <Tabs
        value={subTab}
        onChange={(_: any, tab: string) => setSubTab(tab as FollowersTabType)}
        variant="scrollable"
      >
        <Tab value={"followers"} label={`Seguidores  (${user.numFollowers})`} />
        <Tab value={"following"} label={`Seguidos  (${user.numFollowing})`} />
      </Tabs>
      {subTab === "followers" && (
        <>
          {followers && <FollowTable users={followers} />}
          <DataLoader
            isLoading={isLoading}
            hasData={!!followers?.length}
            retry={refetch}
            error={error}
            hasNextPage={hasNextPage}
            loadMore={fetchNextPage}
          />
        </>
      )}
      {subTab === "following" && (
        <>
          {following && <FollowTable users={following} />}
          <DataLoader
            isLoading={isLoadingFollowing}
            hasData={!!following?.length}
            retry={refetchFollowing}
            error={errorFollowing}
            hasNextPage={hasNextPageFollowing}
            loadMore={fetchNextPageFollowing}
          />
        </>
      )}
    </section>
  );
};

export {
  UserInfoTab,
  UserFeedTab,
  UserTrackingsTab,
  UserStatsTab,
  UserFollowersTab,
};
