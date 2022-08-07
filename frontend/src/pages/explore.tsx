import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, Typography } from "@mui/material";
import {
  CrisisAlert,
  ImageOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";
import Carousel from "react-material-ui-carousel";
import { AxiosError } from "axios";

import { Page } from "layout";
import { useActiveUser, useNotificationStore } from "store";
import { arrayUtils, texts } from "utils";
import { recommendationService } from "services";

import { DataLoader } from "components/molecules";
import {
  GoalTeaserInfo,
  PostTeaser,
  SearchBar,
  UserTeaser,
} from "components/organisms";

type ExploreTabsType = "posts" | "users" | "goals";

const ExplorePage = () => {
  const { activeTab } = useParams();

  const navigate = useNavigate();
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
        title: "Error cargando tus metas",
        variant: "error",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGoalError, goalError]);

  const labels = {
    posts: "Contenido",
    users: "Usuarios",
    goals: "Metas",
  };

  const handleChange = (_: any, tab: string) => {
    navigate(`/explore/${tab}`);
  };

  return (
    <Page title="Explora">
      <div className="flex flex-col gap-3">
        <SearchBar />
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <Typography
            variant="h5"
            className="order-2 !text-center md:-order-1 md:text-left"
          >
            {labels[activeTab as ExploreTabsType]}
          </Typography>

          <Tabs
            value={activeTab}
            onChange={handleChange}
            variant="scrollable"
            allowScrollButtonsMobile
          >
            <Tab value={"goals"} icon={<CrisisAlert />} />
            <Tab value={"posts"} icon={<ImageOutlined />} />
            <Tab value={"users"} icon={<PersonOutlineOutlined />} />
          </Tabs>
        </div>
        <div className="flex flex-col gap-10">
          {activeTab === "goals" &&
            goalRecommendations &&
            Object.entries(goalRecommendations)?.map(([key, goals]) => (
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
                  goals?.map((goal) => (
                    <GoalTeaserInfo key={goal.id} {...goal} />
                  )) || []
                }
              />
            ))}

          {activeTab === "users" &&
            userRecommendations &&
            Object.entries(userRecommendations)?.map(([key, users]) => (
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
                  users?.map((user) => (
                    <UserTeaser key={user?.id} {...user} />
                  )) || []
                }
              />
            ))}

          {activeTab === "posts" &&
            postRecommendations &&
            Object.entries(postRecommendations)?.map(([key, posts]) => (
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
    <section>
      <Typography variant="h5">{props.title}</Typography>
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
        duration={500}
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
    </section>
  );
};

export default ExplorePage;
