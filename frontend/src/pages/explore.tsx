import { useEffect, useMemo } from "react";
import { Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { AxiosError } from "axios";

import { Page } from "layout";
import { useNotificationStore } from "store";
import { goalService, socialService } from "services";
import { arrayUtils, paginationUtils } from "utils";

import { DataLoader } from "components/molecules";
import { GoalTeaserInfo, PostTeaser, UserTeaser } from "components/organisms";

const ExplorePage = () => {
  const { addNotification } = useNotificationStore();

  const {
    data: goalPages,
    isLoading: loadingGoals,
    error: goalError,
    isError: isGoalError,
  } = goalService.useGoals();
  const goals = useMemo(
    () => paginationUtils.combinePages(goalPages),
    [goalPages]
  );

  const {
    data: postPages,
    isLoading: loadingPosts,
    error: postError,
    isError: isPostError,
  } = socialService.usePosts();
  const posts = useMemo(
    () => paginationUtils.combinePages(postPages),
    [postPages]
  );

  const {
    data: userPages,
    isLoading: loadingUsers,
    error: userError,
    isError: isUserError,
  } = socialService.useUsers();
  const users = useMemo(
    () => paginationUtils.combinePages(userPages),
    [userPages]
  );

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
          <ExploreSection
            title="Objetivos"
            loading={loadingGoals}
            error={isGoalError ? goalError : undefined}
            slides={
              goals?.map((goal) => (
                <GoalTeaserInfo key={goal.id} {...goal} />
              )) || []
            }
          />

          <ExploreSection
            title="Usuarios"
            loading={loadingUsers}
            error={isUserError ? userError : undefined}
            slides={
              users?.map((user) => <UserTeaser key={user?.id} {...user} />) ||
              []
            }
          />

          <ExploreSection
            title="Posts"
            loading={loadingPosts}
            error={isPostError ? postError : undefined}
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
