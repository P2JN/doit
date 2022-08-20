import { Skeleton, Typography } from "@mui/material";

import { socialService } from "services";
import { SocialTypes } from "types";

import { Card } from "components/atoms";
import { UserAvatar, UserUsername } from "components/organisms";

const Comment = (comment: SocialTypes.Comment) => {
  const { data: user } = socialService.useUser(comment.createdBy);
  return (
    <Card>
      <div className="flex gap-3">
        <div className="-ml-2">
          {user ? <UserAvatar {...user} /> : <Skeleton variant="circular" />}
        </div>
        <Typography variant="body1">
          {user ? <UserUsername {...user} /> : <Skeleton variant="text" />} :{" "}
          {comment.content || <Skeleton variant="text" />}
        </Typography>
      </div>
    </Card>
  );
};

export default Comment;
