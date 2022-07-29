import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Typography } from "@mui/material";

import { SocialTypes } from "types";
import { socialService } from "services";

import { Card } from "components/atoms";
import { Comment, DataLoader, PostCounters } from "components/molecules";
import { CommentForm } from "components/templates";

const CommentSection = (post: SocialTypes.Post) => {
  const {
    data: commentList,
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
              comments={commentList?.results?.length || post.numComments}
              likes={post.likes}
              postId={post.id}
            />
          )}
        </div>
      </Card>
      <section className="flex flex-col gap-3 overflow-auto py-2">
        {commentList?.results?.map((comment) => (
          <Comment key={comment.id} {...comment} />
        ))}
        <DataLoader
          isLoading={isLoading}
          hasData={!!commentList?.results?.length}
        />
      </section>
      <Card>
        <CommentForm postId={post.id} />
      </Card>
    </div>
  );
};

export default CommentSection;
