import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Typography } from "@mui/material";

import { socialService } from "services";
import { SocialTypes } from "types";
import { useActiveUser } from "store";

import { DataLoader } from "components/molecules";
import { PostTeaser } from "components/organisms";

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
    data: userPosts,
    isLoading,
    refetch,
    error,
  } = socialService.useUserPosts(user.id);

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
      <DataLoader
        isLoading={isLoading}
        hasData={!!userPosts?.length}
        retry={refetch}
        error={error}
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {userPosts?.map((post) => (
          <PostTeaser withoutComments key={post.id} {...post} />
        ))}
      </div>
    </section>
  );
};
const UserTrackingsTab = () => {
  return (
    <section>
      <p>User Trackings Content</p>
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
