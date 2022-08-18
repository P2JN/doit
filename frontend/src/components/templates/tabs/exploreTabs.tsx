import { AxiosError } from "axios";
import { Skeleton, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";

import { useActiveUser } from "store";
import { recommendationService } from "services";
import { arrayUtils, texts } from "utils";

import { DataLoader } from "components/molecules";
import { GoalTeaserInfo, PostTeaser, UserTeaser } from "components/organisms";

const ExploreSection = (props: {
  title: string;
  slides: any[];
  loading?: boolean;
  error?: AxiosError;
}) => {
  const contentChunks = arrayUtils.chunk(props.slides, 3);

  return (
    <section>
      <Typography variant="h5">{props.title}</Typography>
      <DataLoader
        isLoading={props.loading}
        error={props.error}
        hasData={!!props.slides.length}
      />
      <Carousel
        duration={1250}
        interval={7500}
        animation="slide"
        className="hidden lg:block"
        fullHeightHover={false}
      >
        {contentChunks.map((chunk, i) => (
          <div
            key={"chunk-slide-" + i}
            className="grid h-full grid-cols-3 gap-3 p-2"
          >
            {chunk.map((child) => child)}
          </div>
        ))}
      </Carousel>
      <Carousel
        duration={500}
        interval={7500}
        animation="slide"
        className="lg:hidden"
        fullHeightHover={false}
        navButtonsAlwaysInvisible
      >
        {props.slides.map((child, i) => (
          <div key={"mobile-slide-" + i} className="h-full p-2">
            {child}
          </div>
        ))}
      </Carousel>
    </section>
  );
};

const ExploreSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }, () => (
        <div className="mb-3">
          <Skeleton variant="text" width={430} />
          <div className="flex gap-3">
            {Array.from({ length: 3 }, () => (
              <Skeleton variant="rectangular" width={300} height={300} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

const GoalsExploreTab = () => {
  const { activeUser } = useActiveUser();
  const {
    data: goalRecommendations,
    isLoading: loadingGoals,
    error: goalError,
    isError: isGoalError,
  } = recommendationService.useGoalRecommendations(activeUser?.id);

  return (
    <>
      {Object.entries(goalRecommendations || {})?.map(([key, goals]) => (
        <ExploreSection
          key={"goals-" + key}
          title={
            texts.recommendTitles.goals[
              key as keyof typeof texts.recommendTitles.goals
            ]
          }
          loading={loadingGoals}
          error={isGoalError ? goalError : undefined}
          slides={
            goals?.map((goal) => <GoalTeaserInfo key={goal.id} {...goal} />) ||
            []
          }
        />
      ))}
      {(loadingGoals || !goalRecommendations) && <ExploreSkeleton />}
    </>
  );
};

const PostsExploreTab = () => {
  const { activeUser } = useActiveUser();
  const {
    data: postRecommendations,
    isLoading: loadingPosts,
    error: postError,
    isError: isPostError,
  } = recommendationService.usePostRecommendations(activeUser?.id);

  return (
    <>
      {Object.entries(postRecommendations || {})?.map(([key, posts]) => (
        <ExploreSection
          key={"posts-" + key}
          title={
            texts.recommendTitles.posts[
              key as keyof typeof texts.recommendTitles.posts
            ]
          }
          loading={loadingPosts}
          error={isPostError ? postError : undefined}
          slides={
            posts?.map((post) => (
              <PostTeaser withoutComments key={post.id} {...post} />
            )) || []
          }
        />
      ))}
      {(loadingPosts || !postRecommendations) && <ExploreSkeleton />}
    </>
  );
};

const UsersExploreTab = () => {
  const { activeUser } = useActiveUser();

  const {
    data: userRecommendations,
    isLoading: loadingUsers,
    error: userError,
    isError: isUserError,
  } = recommendationService.useUserRecommendations(activeUser?.id);

  return (
    <>
      {Object.entries(userRecommendations || {})?.map(([key, users]) => (
        <ExploreSection
          key={"users-" + key}
          title={
            texts.recommendTitles.users[
              key as keyof typeof texts.recommendTitles.users
            ]
          }
          loading={loadingUsers}
          error={isUserError ? userError : undefined}
          slides={
            users?.map((user) => <UserTeaser key={user?.id} {...user} />) || []
          }
        />
      ))}
      {(loadingUsers || !userRecommendations) && <ExploreSkeleton />}
    </>
  );
};

export { UsersExploreTab, GoalsExploreTab, PostsExploreTab };
