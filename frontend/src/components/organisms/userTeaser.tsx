import { useNavigate } from "react-router-dom";
import { Person } from "@mui/icons-material";
import { Typography } from "@mui/material";

import { SocialTypes } from "types";

const UserTeaserReduced = (user: SocialTypes.User) => {
  const navigate = useNavigate();
  const onOpenUser = () => navigate("/users/" + user.id);

  return (
    <header
      className="-mr-2 flex cursor-pointer items-center"
      onClick={onOpenUser}
    >
      <div className="-mr-4 rounded-l-full bg-gray-100 px-4 py-1">
        <Typography className="hover:font-bold" variant="body1">
          @{user.username}
        </Typography>
      </div>
      <div className="flex items-center justify-center rounded-full bg-gray-100 p-4">
        <Person />
      </div>
    </header>
  );
};

export { UserTeaserReduced };
