import { IconButton, Typography } from "@mui/material";
import { useMatch, useNavigate } from "react-router-dom";
import { CrisisAlert } from "@mui/icons-material";

import { SocialTypes } from "types";
import { goalService, socialService } from "services";

import { Card, Image } from "components/atoms";
import { PostCounters } from "components/molecules";
import {
  CommentSection,
  GoalTeaserReduced,
  UserAvatar,
  UserUsername,
} from "components/organisms";
import { dateUtils } from "utils";

const PostTeaser = (post: SocialTypes.Post & { withoutComments?: boolean }) => {
  const { data: user } = socialService.useUser(post.createdBy);
  const { data: goal } = goalService.useGoal(post.goal);

  const isGoalDetail = useMatch("/goals/:id/feed");

  return (
    <div
      className={
        "grid h-full gap-4 lg:grid-cols-2" +
        (post.withoutComments ? "!grid-cols-1" : "")
      }
    >
      <div className="flex h-full flex-col gap-3">
        {goal && !isGoalDetail && !post.withoutComments && (
          <GoalTeaserReduced {...goal} />
        )}
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
            {post.withoutComments && (
              <Typography variant="body1">
                {dateUtils.beautifyDate(post.creationDate)}
              </Typography>
            )}
            <Typography
              variant="body1"
              className={post.withoutComments ? "line-clamp-4" : ""}
            >
              {user && <UserUsername {...user} />} : {post.content}
            </Typography>
          </section>
          <footer className="mt-auto flex items-center justify-between">
            {user && <UserAvatar {...user} />}
            {post.withoutComments && post.id ? (
              <PostCounters
                comments={post.numComments}
                likes={post.likes}
                postId={post.id}
              />
            ) : (
              <Typography variant="body1">
                {dateUtils.beautifyDate(post.creationDate)}
              </Typography>
            )}
          </footer>
        </Card>
      </div>
      {!post.withoutComments && <CommentSection {...post} />}
    </div>
  );
};

const PostSearchResult = (post: SocialTypes.Post) => {
  const navigate = useNavigate();

  const { data: user } = socialService.useUser(post.createdBy);
  const onOpenGoal = () => navigate("/goals/" + post.goal + "/feed");

  return (
    <article>
      <section>
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
          />
        )}
      </section>
    </article>
  );
};

export { PostTeaser, PostSearchResult };
