import { Typography } from "@mui/material";

import { socialService } from "services";
import { SocialTypes } from "types";

import { Card } from "components/atoms";
import { UserTeaserReduced } from "components/organisms";

const Comment = (comment: SocialTypes.Comment) => {
  const { data: user } = socialService.useUser(comment.createdBy);
  return (
    <Card>
      <div className="flex justify-between">
        <Typography variant="body1">{comment.content}</Typography>
        {user && <UserTeaserReduced {...user} />}
      </div>
    </Card>
  );
};

export default Comment;
