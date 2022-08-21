import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Typography } from "@mui/material";

import { SocialTypes } from "types";
import { socialService } from "services";
import { paginationUtils } from "utils";

import { Card } from "components/atoms";
import { Comment, DataLoader, PostCounters } from "components/molecules";
import { CommentForm } from "components/templates";

const CommentSection = (
  post: SocialTypes.Post & { onCommentsClick: () => void }
) => {
  const {
    data: commentPages,
    isLoading,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = socialService.usePostComments(post.id);
  const comments = useMemo(
    () => paginationUtils.combinePages(commentPages),
    [commentPages]
  );
  const nOfComments = useMemo(
    () => commentPages?.pages?.[0]?.count,
    [commentPages]
  );

  const location = useLocation();
  useEffect(() => {
    refetch();
  }, [location, refetch]);

  const commentListRef = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    if (!isLoading)
      setTimeout(() => {
        if (commentListRef.current)
          commentListRef.current.scrollTop =
            commentListRef.current.scrollHeight;
      }, 100);
  }, [isLoading]);

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <div className="flex items-center justify-between">
          <Typography variant="h6">
            <strong>Interacciones</strong>
          </Typography>
          {post.id && (
            <PostCounters
              comments={nOfComments || post.numComments}
              likes={post.likes}
              postId={post.id}
              onCommentsClick={post.onCommentsClick}
            />
          )}
        </div>
      </Card>
      <div className="hidden flex-col gap-3 md:flex">
        <section
          ref={commentListRef}
          className="grid max-h-[420px] gap-3 overflow-auto p-2"
        >
          <DataLoader
            isLoading={isLoading}
            hasData={!!comments?.length}
            hasNextPage={hasNextPage}
            loadMore={fetchNextPage}
            topPositioned
          />
          {comments?.reverse()?.map((comment) => (
            <Comment key={comment.id} {...comment} />
          ))}
        </section>
        <Card>
          <CommentForm postId={post.id} onComment={refetch} />
        </Card>
      </div>
    </div>
  );
};

export default CommentSection;
