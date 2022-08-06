import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, IconButton, Typography } from "@mui/material";
import { CameraAlt } from "@mui/icons-material";

import { SocialTypes } from "types";
import { useActiveUser } from "store";
import { mediaUtils } from "utils";

import { Card } from "components/atoms";
import { FollowButton, UserCounters } from "components/molecules";

const UserTeaser = (user: SocialTypes.User) => {
  const navigate = useNavigate();
  const onOpenUser = () => navigate("/users/" + user.id + "/info");
  return (
    <Card className="cursor-pointer" onClick={onOpenUser}>
      {user.urlMedia && (
        <div className="-mx-7 -mt-5 flex items-center justify-between">
          <img
            src={user.urlMedia}
            alt="userimg"
            className="w-full text-center"
          />
        </div>
      )}
      <header className="flex cursor-pointer flex-wrap-reverse items-center justify-between gap-3">
        <Typography variant="h5">
          <strong onClick={onOpenUser}>{user.firstName}</strong>
        </Typography>
        <div className="ml-auto">
          <UserTeaserReduced {...user} />
        </div>
      </header>
      <footer className="flex justify-end" onClick={onOpenUser}>
        <UserCounters followers={user.numFollowers} posts={user.numPosts} />
      </footer>
    </Card>
  );
};

const UserTeaserInfo = (user: SocialTypes.User) => {
  const navigate = useNavigate();

  const { activeUser } = useActiveUser();
  const isMyProfile = useMemo(
    () => activeUser?.id === user.id,
    [activeUser?.id, user.id]
  );

  return (
    <header className="flex w-full flex-wrap items-center justify-between gap-2 md:justify-start md:gap-5">
      <div className="flex w-full justify-center md:w-auto">
        <Avatar
          alt="userimg"
          src={mediaUtils.sanitizeMediaUrl(user?.urlMedia)}
          className="!h-[85px] !w-[85px] rounded-full border-2 border-gray-300 md:!h-[180px] md:!w-[180px]"
        />
      </div>

      <div
        className={
          "flex items-center gap-3 rounded-full bg-gray-100 px-4 md:-ml-9 md:rounded-l-none md:pl-5 " +
          (isMyProfile ? "py-2" : "py-3")
        }
      >
        {isMyProfile && (
          <IconButton onClick={() => navigate("update-photo")}>
            <CameraAlt />
          </IconButton>
        )}
        <Typography className="cursor-pointer hover:font-bold" variant="h5">
          @{user.username}
        </Typography>
      </div>
      <div className="flex items-center gap-3 rounded-full bg-gray-100 py-3 px-4">
        <UserCounters followers={user.numFollowers} posts={user.numPosts} />
      </div>

      {!isMyProfile && (
        <div className="md:order-auto order-first flex w-full justify-center md:w-auto">
          <FollowButton {...user} />
        </div>
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
      <Avatar alt="userimg" src={mediaUtils.sanitizeMediaUrl(user?.urlMedia)} />
    </header>
  );
};

const UserUsername = (user: SocialTypes.User) => {
  const navigate = useNavigate();
  const onOpenUser = () => navigate("/users/" + user.id + "/info");
  return (
    <strong className="cursor-pointer hover:!underline" onClick={onOpenUser}>
      @{user.username}
    </strong>
  );
};

const UserAvatar = (user: SocialTypes.User) => {
  const navigate = useNavigate();
  const onOpenUser = () => navigate("/users/" + user.id + "/info");

  return (
    <Avatar
      onClick={onOpenUser}
      className="cursor-pointer"
      alt="userimg"
      src={mediaUtils.sanitizeMediaUrl(user?.urlMedia)}
    />
  );
};

export {
  UserTeaserReduced,
  UserTeaser,
  UserTeaserInfo,
  UserUsername,
  UserAvatar,
};
