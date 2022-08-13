import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";

import { socialService } from "services";
import { useActiveUser, useNotificationStore } from "store";
import { SocialTypes } from "types";

const FollowButton = (user: SocialTypes.User) => {
  const { activeUser } = useActiveUser();
  const { addNotification } = useNotificationStore();
  const [params, setSearchParams] = useSearchParams();

  const { data: followData, refetch: refetchFollowData } =
    socialService.useFollowData(user.id, activeUser?.id);

  const isFollowing = useMemo(() => !!followData, [followData]);

  const { mutate: follow, isLoading: loadingFollow } =
    socialService.useFollow();

  const { mutate: unfollow, isLoading: loadingUnfollow } =
    socialService.useUnfollow();

  const onFollowClick = () => {
    if (user.id) {
      if (isFollowing && followData?.id) {
        unfollow(followData.id, {
          onSuccess: () => {
            refetchFollowData();
            !params.get("q") && setSearchParams("?refresh=user");
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
                !params.get("q") && setSearchParams("?refresh=user");
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
      {loadingFollow || loadingUnfollow ? (
        <CircularProgress size={18} />
      ) : isFollowing ? (
        "No seguir"
      ) : (
        "Seguir"
      )}
    </Button>
  );
};

export default FollowButton;
