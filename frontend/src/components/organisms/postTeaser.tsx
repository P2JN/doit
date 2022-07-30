import { Typography } from "@mui/material";
import { useMatch } from "react-router-dom";

import { SocialTypes } from "types";
import { goalService, socialService } from "services";

import { Card } from "components/atoms";
import { PostCounters } from "components/molecules";
import {
  UserTeaserReduced,
  CommentSection,
  GoalTeaserReduced,
} from "components/organisms";

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
      <div className="flex flex-col gap-3">
        {goal && !isGoalDetail && !post.withoutComments && (
          <GoalTeaserReduced {...goal} />
        )}
        <Card className="h-full">
          <div className="-mx-7 -mt-5 flex items-center justify-between">
            {/* TODO: use real media photo */}
            <img
              src="https://picsum.photos/1000"
              alt="post"
              className="w-full text-center"
            />
          </div>
          <header className="flex items-center justify-between">
            <Typography variant="h5">
              <strong>{post.title}</strong>
            </Typography>
            {user && <UserTeaserReduced {...user} />}
          </header>
          <section className="mb-4">
            <Typography variant="body1">{post.content}</Typography>
          </section>
          <footer className="mt-auto flex justify-end">
            {post.withoutComments && post.id && (
              <PostCounters
                comments={post.numComments}
                likes={post.likes}
                postId={post.id}
              />
            )}
          </footer>
        </Card>
      </div>
      {!post.withoutComments && <CommentSection {...post} />}
    </div>
  );
};

export { PostTeaser };
