import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Tab, Tabs, Typography } from "@mui/material";

import { goalService, socialService } from "services";
import { SocialTypes } from "types";
import { useActiveUser } from "store";
import { paginationUtils } from "utils";

import { DataLoader } from "components/molecules";
import { FollowTable, PostTeaser, TrackingTeaser } from "components/organisms";

const UserInfoTab = (user: SocialTypes.User) => {
  return (
    <section className="mb-10 flex flex-col gap-5">
      <p>User Info</p>
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

  const [params, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (params.get("refresh") === "user-posts") {
      refetch();
      setSearchParams("");
    }
  }, [params, refetch, setSearchParams]);

  return (
    <section className="animate-fade-in">
      {isMyProfile && (
        <div className="mb-3 flex justify-between">
          <Typography variant="h5">Mis posts</Typography>
          <Button onClick={() => navigate("new-post")}>Nuevo</Button>
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {posts?.map((post) => (
          <PostTeaser withoutComments key={post.id} {...post} />
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
        <Typography variant="h5">Últimos Progresos</Typography>
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
const UserStatsTab = () => {
  return (
    <section>
      <p>User Stats Content</p>
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

  const [params, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (params.get("refresh") === "user") {
      refetch();
      refetchFollowing();
      setSearchParams("");
    }
  }, [params, refetch, refetchFollowing, setSearchParams]);

  return (
    <section className="animate-fade-in">
      <Tabs
        value={subTab}
        onChange={(_: any, tab: string) => setSubTab(tab as FollowersTabType)}
        variant="scrollable"
      >
        <Tab value={"followers"} label="Seguidores" />
        <Tab value={"following"} label="Siguiendo" />
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
