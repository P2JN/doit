import { Typography } from "@mui/material";
import { CommentOutlined, FavoriteBorder } from "@mui/icons-material";

import { SocialTypes } from "types";
import { useActiveUser } from "store";

import { Card } from "components/atoms";
import { Comment } from "components/molecules";
import { CommentForm } from "components/templates";

const CommentSection = (post: SocialTypes.Post) => {
  const { activeUser } = useActiveUser();
  const mockedComments = (): SocialTypes.Comment[] => {
    return activeUser?.id
      ? [
          {
            id: "1",
            content: "This is a comment",
            createdBy: activeUser?.id,
            creationDate: "2020-01-01",
            post: post?.id || "",
          },
          {
            id: "2",
            content: "This is a comment",
            createdBy: activeUser?.id,
            creationDate: "2020-01-01",
            post: post?.id || "",
          },
        ]
      : ([] as SocialTypes.Comment[]);
  };
  return (
    <div className="flex flex-col gap-3">
      <Card>
        <div className="flex items-center justify-between">
          <Typography variant="h5">
            <strong>Comentarios</strong>
          </Typography>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2">
              {mockedComments()?.length}
              <CommentOutlined />
            </span>
            <span className="flex items-center gap-2">
              {3}
              <FavoriteBorder />
            </span>
          </div>
        </div>
      </Card>
      <section className="flex flex-col gap-3 overflow-auto pb-3">
        {mockedComments()?.map((comment) => (
          <Comment {...comment} />
        ))}
      </section>
      <Card>
        <CommentForm />
      </Card>
    </div>
  );
};

export default CommentSection;
