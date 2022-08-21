import { useMemo } from "react";
import { IconButton, Typography } from "@mui/material";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import {
  CrisisAlert,
  ImageOutlined,
  TextSnippetOutlined,
} from "@mui/icons-material";

import { SocialTypes } from "types";
import { goalService, socialService } from "services";
import { dateUtils, paginationUtils } from "utils";

import { Card, Image } from "components/atoms";
import { Comment, DataLoader, PostCounters } from "components/molecules";
import {
  CommentSection,
  GoalTeaserReduced,
  UserAvatar,
  UserUsername,
} from "components/organisms";
import { CommentForm } from "components/templates";

const PostTeaser = (post: SocialTypes.Post) => {
  const navigate = useNavigate();
  const { data: user } = socialService.useUser(post.createdBy);
  const { data: goal } = post?.goal
    ? goalService.useGoal(post?.goal)
    : { data: null };

  const isGoalDetail = useMatch("/goals/:id/feed");
  const isPostDetail = useMatch("/posts/:id");

  return (
    <div className="grid h-full gap-4 lg:grid-cols-2">
      <div className="flex h-full flex-col gap-3">
        {goal && !isGoalDetail && <GoalTeaserReduced {...goal} />}
        <Card className="!h-full">
          {post?.urlMedia && (
            <div className="-mx-7 -mt-5 flex items-center justify-between transition-all duration-200 ease-in-out hover:-mx-10">
              <Image src={post.urlMedia} alt={post.title} />
            </div>
          )}
          <header className="flex flex-wrap-reverse items-center justify-between gap-3">
            <Typography variant="h5">
              <strong>{post.title}</strong>
            </Typography>
          </header>
          <section className="mb-4 flex flex-col gap-1">
            <Typography variant="body1">
              {user && <UserUsername {...user} />} : {post.content}
            </Typography>
          </section>
          <footer className="mt-auto flex items-center justify-between">
            {user && <UserAvatar {...user} />}
            <Typography variant="body1">
              {dateUtils.beautifyDate(post.creationDate)}
            </Typography>
          </footer>
        </Card>
      </div>
      <CommentSection
        {...post}
        onCommentsClick={() =>
          navigate((isPostDetail ? "" : post.id + "/") + "comments")
        }
      />
    </div>
  );
};

const PostTeaserWithoutComments = (post: SocialTypes.Post) => {
  const { data: user } = socialService.useUser(post.createdBy);

  const navigate = useNavigate();
  const onOpenPost = () => navigate("/posts/" + post.id);

  return (
    <Card className="!h-full">
      <header
        onClick={onOpenPost}
        className="flex cursor-pointer flex-wrap-reverse items-center justify-between gap-3"
      >
        <Typography variant="h5">
          {post?.urlMedia ? (
            <ImageOutlined className="mr-2 mb-1" />
          ) : (
            <TextSnippetOutlined className="mr-2 mb-1" />
          )}
          <strong>{post.title}</strong>
        </Typography>
      </header>
      <section className="mb-4 flex flex-col gap-1">
        <Typography variant="body1" onClick={onOpenPost}>
          {dateUtils.beautifyDate(post.creationDate)}
        </Typography>
        <Typography variant="body1" className="line-clamp-4">
          {user && <UserUsername {...user} />} :{" "}
          <span onClick={onOpenPost}>{post.content}</span>
        </Typography>
      </section>
      <footer className="mt-auto flex items-center justify-between">
        {user && <UserAvatar {...user} />}
        {post.id && (
          <PostCounters
            comments={post.numComments}
            likes={post.likes}
            postId={post.id}
            onCommentsClick={onOpenPost}
          />
        )}
      </footer>
    </Card>
  );
};

const PostComments = () => {
  const { postId } = useParams();
  const {
    data: commentPages,
    isLoading,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = socialService.usePostComments(postId);
  const comments = useMemo(
    () => paginationUtils.combinePages(commentPages),
    [commentPages]
  );

  return (
    <div className="flex flex-col gap-3">
      <section className="mx-px mb-3 grid max-h-[60vh] gap-3 overflow-auto px-1 py-2">
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
      <CommentForm postId={postId} onComment={refetch} />
    </div>
  );
};

const PostSearchResult = (post: SocialTypes.Post) => {
  const navigate = useNavigate();

  const { data: user } = socialService.useUser(post.createdBy);
  const onOpenGoal = () => navigate("/goals/" + post.goal + "/feed");
  const onOpenPost = () => navigate("/posts/" + post.id);

  return (
    <article>
      <section onClick={onOpenPost} className="cursor-pointer">
        <Typography variant="h6" className="!font-bold leading-tight">
          {post.title}
        </Typography>
      </section>
      <section className="flex cursor-pointer items-center gap-4 py-1">
        {user && <UserAvatar {...user} />}
        <div className="!mr-auto">{user && <UserUsername {...user} />}</div>
        {post.goal && (
          <IconButton onClick={onOpenGoal}>
            <CrisisAlert />
          </IconButton>
        )}
        {post.id && (
          <PostCounters
            postId={post.id}
            comments={post.numComments}
            likes={post.likes}
            onCommentsClick={onOpenPost}
          />
        )}
      </section>
    </article>
  );
};

export {
  PostTeaser,
  PostSearchResult,
  PostComments,
  PostTeaserWithoutComments,
};
