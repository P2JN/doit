import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";

import { socialService } from "services";
import { useActiveUser, useNotificationStore } from "store";
import { SocialTypes } from "types";

const FollowButton = (user: SocialTypes.User) => {
  const { activeUser } = useActiveUser();
  const { addNotification } = useNotificationStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSearchParams] = useSearchParams();

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
              content: "Ya no verás sus posts en el feed.",
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
                  content: "Verás sus posts en el feed.",
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
    <Button
      size="large"
      className="ml-auto rounded-full"
      color={isFollowing ? "error" : "success"}
      onClick={onFollowClick}
    >
      {isFollowing ? "No seguir" : "Seguir"}
    </Button>
  );
};

export default FollowButton;