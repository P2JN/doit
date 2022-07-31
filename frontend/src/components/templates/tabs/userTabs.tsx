import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Typography } from "@mui/material";

import { goalService, socialService } from "services";
import { SocialTypes } from "types";
import { useActiveUser } from "store";
import { paginationUtils } from "utils";

import { DataLoader } from "components/molecules";
import { PostTeaser, TrackingTeaser } from "components/organisms";

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

export { UserInfoTab, UserFeedTab, UserTrackingsTab, UserStatsTab };
