import { useNavigate } from "react-router-dom";
import { Avatar, Typography } from "@mui/material";

import { SocialTypes } from "types";
import { Card } from "components/atoms";
import { UserCounters } from "components/molecules";

const UserTeaser = (user: SocialTypes.User) => {
  const navigate = useNavigate();
  const onOpenUser = () => navigate("/users/" + user.id);
  return (
    <Card>
      <div className="-mx-7 -mt-5 flex items-center justify-between">
        {/* TODO: use real media photo */}
        <img
          src="https://placekitten.com/1000/1000"
          alt="userimg"
          className="w-full text-center"
        />
      </div>
      <header
        className="flex cursor-pointer items-center justify-between"
        onClick={onOpenUser}
      >
        <Typography variant="h5">
          <strong className="cursor-pointer" onClick={onOpenUser}>
            {user.firstName}
          </strong>
        </Typography>
        <UserTeaserReduced {...user} />
      </header>
      <footer className="flex justify-end">
        <UserCounters followers={user.numFollowers || 0} posts={3} />
      </footer>
    </Card>
  );
};

const UserTeaserReduced = (user: SocialTypes.User) => {
  const navigate = useNavigate();
  const onOpenUser = () => navigate("/users/" + user.id);

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

export { UserTeaserReduced, UserTeaser };
