import { ReactNode, useEffect } from "react";
import { CircularProgress, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";

import { Page } from "layout";
import { useNotificationStore } from "store";
import { goalService, socialService } from "services";
import { arrayUtils } from "utils";

import { ParsedError } from "components/atoms";
import { GoalTeaserInfo, PostTeaser, UserTeaser } from "components/organisms";

const ExplorePage = () => {
  const { addNotification } = useNotificationStore();

  const {
    data: goals,
    isLoading: loadingGoals,
    error: goalError,
    isError: isGoalError,
  } = goalService.useGoals();

  const {
    data: posts,
    isLoading: loadingPosts,
    error: postError,
    isError: isPostError,
  } = socialService.usePosts();

  const {
    data: users,
    isLoading: loadingUsers,
    error: userError,
    isError: isUserError,
  } = socialService.useUsers();

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
    <Page title="Explore">
      <div className="flex flex-col gap-3">
        <Typography variant="h5">Descubre</Typography>
        <div className="flex flex-col gap-10">
          <ExploreSection
            title="Objetivos"
            loading={loadingGoals}
            error={isGoalError ? <ParsedError {...goalError} /> : undefined}
            slides={
              goals?.map((goal) => (
                <GoalTeaserInfo key={goal.id} {...goal} />
              )) || []
            }
          />

          <ExploreSection
            title="Usuarios"
            loading={loadingUsers}
            error={isUserError ? <ParsedError {...userError} /> : undefined}
            slides={
              users?.map((user) => <UserTeaser key={user.id} {...user} />) || []
            }
          />

          <ExploreSection
            title="Posts"
            loading={loadingPosts}
            error={isPostError ? <ParsedError {...postError} /> : undefined}
            slides={
              posts?.map((post) => (
                <PostTeaser withoutComments key={post.id} {...post} />
              )) || []
            }
          />
        </div>
      </div>
    </Page>
  );
};

const ExploreSection = (props: {
  title: string;
  slides: any[];
  loading?: boolean;
  error?: ReactNode;
}) => {
  const contentChunks = arrayUtils.chunk(props.slides, 3);

  return (
    <>
      <Typography variant="h6">{props.title}</Typography>
      <Carousel
        duration={1000}
        interval={5000}
        animation="slide"
        className="hidden lg:block"
      >
        {contentChunks.map((chunk) => (
          <div className="grid grid-cols-3 gap-3 px-3">
            {chunk.map((child) => child)}
          </div>
        ))}
      </Carousel>
      <Carousel
        duration={1000}
        interval={5000}
        animation="slide"
        className="lg:hidden"
      >
        {props.slides.map((child) => (
          <div className="px-3">{child}</div>
        ))}
      </Carousel>
      {props.loading && <CircularProgress />}
      {props.error && props.error}
    </>
  );
};

export default ExplorePage;
