import { Typography } from "@mui/material";

import { SocialTypes } from "types";
import { useActiveUser } from "store";

import { Card } from "components/atoms";
import { Comment, PostCounters } from "components/molecules";
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
          {post.id && <PostCounters comments={2} likes={3} postId={post.id} />}
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
