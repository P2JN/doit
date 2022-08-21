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
    <Card className="!h-full cursor-pointer" onClick={onOpenUser}>
      <header className="flex cursor-pointer flex-wrap-reverse items-center justify-between gap-3">
        <Typography variant="h5">
          <strong onClick={onOpenUser}>{user.firstName}</strong>
        </Typography>
        <UserAvatar {...user} />
      </header>
      <section className="flex flex-wrap-reverse gap-3">
        <UserUsername {...user} />
      </section>
      <footer
        className="mt-auto flex items-center justify-end"
        onClick={onOpenUser}
      >
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
        <Typography className="cursor-pointer hover:font-bold" variant="h6">
          @{user.username}
        </Typography>
      </div>
      <div className="flex items-center gap-3 rounded-full bg-gray-100 py-3 px-4">
        <UserCounters followers={user.numFollowers} posts={user.numPosts} />
      </div>

      {!isMyProfile && (
        <div className="order-first flex w-full justify-center md:order-last md:w-auto">
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

const UserSearchResult = (user: SocialTypes.User) => {
  const navigate = useNavigate();
  const onOpenUser = () => navigate("/users/" + user.id + "/info");

  const { activeUser } = useActiveUser();

  const isMyProfile = useMemo(
    () => activeUser?.id === user.id,
    [activeUser?.id, user.id]
  );

  return (
    <article>
      <section onClick={onOpenUser} className="cursor-pointer">
        <Typography variant="h6" className="!font-bold leading-tight">
          {user.firstName} {user.lastName}
        </Typography>
      </section>
      <section className="flex cursor-pointer items-center gap-4 py-1">
        {user && <UserAvatar {...user} />}
        <div className="!mr-auto">{user && <UserUsername {...user} />}</div>
        {!isMyProfile && <FollowButton {...user} />}
        <UserCounters followers={user.numFollowers} posts={user.numPosts} />
      </section>
    </article>
  );
};

export {
  UserTeaserReduced,
  UserTeaser,
  UserTeaserInfo,
  UserUsername,
  UserAvatar,
  UserSearchResult,
};
