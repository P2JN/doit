import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CircularProgress, Typography } from "@mui/material";

import { SocialTypes } from "types";
import { socialService } from "services";

import { Card } from "components/atoms";
import { Comment, PostCounters } from "components/molecules";
import { CommentForm } from "components/templates";

const CommentSection = (post: SocialTypes.Post) => {
  const {
    data: comments,
    isLoading,
    refetch,
  } = socialService.usePostComments(post.id);

  const [params, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (params.get("refresh") === post.id) {
      refetch();
      setSearchParams("");
    }
  }, [post.id, params, refetch, setSearchParams]);

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <div className="flex items-center justify-between">
          <Typography variant="h5">
            <strong>Comentarios</strong>
          </Typography>
          {post.id && (
            <PostCounters
              comments={comments?.length || post.numComments}
              likes={post.likes}
              postId={post.id}
            />
          )}
        </div>
      </Card>
      <section className="flex flex-col gap-3 overflow-auto pb-3">
        {comments?.map((comment) => (
          <Comment key={comment.id} {...comment} />
        ))}
        {isLoading && <CircularProgress />}
      </section>
      <Card>
        <CommentForm postId={post.id} />
      </Card>
    </div>
  );
};

export default CommentSection;
