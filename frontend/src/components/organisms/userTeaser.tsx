import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Avatar, Button, Typography } from "@mui/material";

import { SocialTypes } from "types";
import { socialService } from "services";
import { useNotificationStore, useActiveUser } from "store";

import { Card } from "components/atoms";
import { UserCounters } from "components/molecules";

const UserTeaser = (user: SocialTypes.User) => {
  const navigate = useNavigate();
  const onOpenUser = () => navigate("/users/" + user.id + "/info");
  return (
    <Card className="cursor-pointer" onClick={onOpenUser}>
      <div className="-mx-7 -mt-5 flex items-center justify-between">
        {/* TODO: use real media photo */}
        <img
          src="https://placekitten.com/1000/1000"
          alt="userimg"
          className="w-full text-center"
        />
      </div>
      <header className="flex cursor-pointer items-center justify-between">
        <Typography variant="h5">
          <strong onClick={onOpenUser}>{user.firstName}</strong>
        </Typography>
        <UserTeaserReduced {...user} />
      </header>
      <footer className="flex justify-end" onClick={onOpenUser}>
        <UserCounters followers={user.numFollowers} posts={user.numPosts} />
      </footer>
    </Card>
  );
};

const UserTeaserInfo = (user: SocialTypes.User) => {
  const { addNotification } = useNotificationStore();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams();

  const { activeUser } = useActiveUser();
  const isMyProfile = useMemo(
    () => activeUser?.id === user.id,
    [activeUser?.id, user.id]
  );

  const { data: followData, refetch: refetchFollowData } =
    socialService.useFollowData(user.id, activeUser?.id);

  const isFollowing = useMemo(() => !!followData, [followData]);

  const { mutate: follow } = socialService.useFollow();

  const { mutate: unfollow } = socialService.useUnfollow();

  const onFollowClick = () => {
    if (user.id) {
      if (isFollowing && followData?.id) {
        unfollow(followData.id, {
          onSuccess: () => {
            refetchFollowData();
            setSearchParams("?refresh=user");
            addNotification({
              title: "Has dejado de seguir a este usuario.",
              content: "Ya no ver??s sus posts en el feed.",
              type: "transient",
              variant: "success",
            });
          },
        });
      } else {
        if (activeUser?.id)
          follow(
            {
              follower: activeUser?.id,
              user: user.id,
            },
            {
              onSuccess: () => {
                refetchFollowData();
                setSearchParams("?refresh=user");
                addNotification({
                  title: "Has comenzado a seguir a este usuario.",
                  content: "Ver??s sus posts en el feed.",
                  type: "transient",
                  variant: "success",
                });
              },
            }
          );
      }
    }
  };

  return (
    <header className="flex w-full cursor-pointer items-center gap-5">
      {/* TODO: use real media photo */}
      <Avatar
        alt="userimg"
        src="https://placekitten.com/1000/1000"
        style={{ width: "200px", height: "200px" }}
        className="rounded-full border-2 border-gray-300"
      />

      <div className="-ml-5 flex items-center gap-3 rounded-r-full bg-gray-100 py-3 pr-4 pl-5">
        <Typography className="hover:font-bold" variant="h5">
          @{user.username}
        </Typography>
      </div>
      <div className="flex items-center gap-3 rounded-full bg-gray-100 py-3 px-4 !text-lg">
        <UserCounters followers={user.numFollowers} posts={user.numPosts} />
      </div>
      {!isMyProfile && (
        <Button
          size="large"
          className="ml-auto rounded-full"
          color={isFollowing ? "error" : "success"}
          onClick={onFollowClick}
        >
          {isFollowing ? "No seguir" : "Seguir"}
        </Button>
      )}
    </header>
  );
};

const UserTeaserReduced = (user: SocialTypes.User) => {
  const navigate = useNavigate();
  const onOpenUser = () => navigate("/users/" + user.id + "/info");

  return (
    <header
      className="ml-2 -mr-2 flex cursor-pointer items-center"
      onClick={onOpenUser}
    >
      <div className="-mr-4 rounded-l-full bg-gray-100 py-1 pl-2 pr-5">
        <Typography className="hover:font-bold" variant="body2">
          @{user.username}
        </Typography>
      </div>
      {/* TODO: use real media photo */}
      <Avatar alt="userimg" src="https://placekitten.com/1000/1000" />
    </header>
  );
};

export { UserTeaserReduced, UserTeaser, UserTeaserInfo };
