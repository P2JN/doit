import { useEffect } from "react";
import { Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { AxiosError } from "axios";

import { Page } from "layout";
import { useActiveUser, useNotificationStore } from "store";
import { arrayUtils } from "utils";
import recommendationService from "services/recommendationService";

import { DataLoader } from "components/molecules";
import { GoalTeaserInfo, PostTeaser, UserTeaser } from "components/organisms";

const ExplorePage = () => {
  const { addNotification } = useNotificationStore();
  const { activeUser } = useActiveUser();

  const {
    data: goalRecommendations,
    isLoading: loadingGoals,
    error: goalError,
    isError: isGoalError,
  } = recommendationService.useGoalRecommendations(activeUser?.id);

  const {
    data: postRecommendations,
    isLoading: loadingPosts,
    error: postError,
    isError: isPostError,
  } = recommendationService.usePostRecommendations(activeUser?.id);

  const {
    data: userRecommendations,
    isLoading: loadingUsers,
    error: userError,
    isError: isUserError,
  } = recommendationService.useUserRecommendations(activeUser?.id);

  useEffect(() => {
    if (isGoalError) {
      addNotification({
        content: goalError.message,
        title: "Error loading goals",
        variant: "error",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGoalError, goalError]);

  return (
    <Page title="Explora">
      <div className="flex flex-col gap-3">
        <Typography variant="h5">Descubre</Typography>
        <div className="flex flex-col gap-10">
          <Typography variant="h4">Metas</Typography>
          {goalRecommendations &&
            Object.entries(goalRecommendations)?.map(([key, goals]) => (
              <ExploreSection
                title={key}
                loading={loadingGoals}
                error={isGoalError ? goalError : undefined}
                slides={
                  goals?.map((goal) => (
                    <GoalTeaserInfo key={goal.id} {...goal} />
                  )) || []
                }
              />
            ))}

          <Typography variant="h4">Usuarios</Typography>
          {userRecommendations &&
            Object.entries(userRecommendations)?.map(([key, users]) => (
              <ExploreSection
                title={key}
                loading={loadingUsers}
                error={isUserError ? userError : undefined}
                slides={
                  users?.map((user) => (
                    <UserTeaser key={user?.id} {...user} />
                  )) || []
                }
              />
            ))}

          <Typography variant="h4">Posts</Typography>
          {postRecommendations &&
            Object.entries(postRecommendations)?.map(([key, posts]) => (
              <ExploreSection
                title={key}
                loading={loadingPosts}
                error={isPostError ? postError : undefined}
                slides={
                  posts?.map((post) => (
                    <PostTeaser withoutComments key={post.id} {...post} />
                  )) || []
                }
              />
            ))}
        </div>
      </div>
    </Page>
  );
};

const ExploreSection = (props: {
  title: string;
  slides: any[];
  loading?: boolean;
  error?: AxiosError;
}) => {
  const contentChunks = arrayUtils.chunk(props.slides, 3);

  return (
    <>
      <Typography variant="h6">{props.title}</Typography>
      <DataLoader
        isLoading={props.loading}
        error={props.error}
        hasData={!!props.slides.length}
      />
      <Carousel
        duration={1500}
        interval={7500}
        animation="slide"
        className="hidden lg:block"
      >
        {contentChunks.map((chunk, i) => (
          <div key={"chunk-slide-" + i} className="grid grid-cols-3 gap-3 px-3">
            {chunk.map((child) => child)}
          </div>
        ))}
      </Carousel>
      <Carousel
        duration={1500}
        interval={7500}
        animation="slide"
        className="lg:hidden"
      >
        {props.slides.map((child, i) => (
          <div key={"mobile-slide-" + i} className="px-3">
            {child}
          </div>
        ))}
      </Carousel>
    </>
  );
};

export default ExplorePage;
