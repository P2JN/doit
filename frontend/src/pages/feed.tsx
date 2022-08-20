import { useEffect, useMemo } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";

import { Page } from "layout";
import { socialService } from "services";
import { useActiveUser } from "store";
import { SocialTypes } from "types";
import { paginationUtils } from "utils";

import { DataLoader } from "components/molecules";
import { ModalDrawer, PostTeaser } from "components/organisms";
import { PostForm } from "components/templates";

const FeedPage = () => {
  const { activeUser } = useActiveUser();

  const {
    data: postPages,
    isLoading: loadingPosts,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = socialService.useFeedPosts(activeUser?.id);
  const posts = useMemo(
    () => paginationUtils.combinePages(postPages),
    [postPages]
  );

  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    refetch();
  }, [location, refetch]);

  return (
    <Page title="Contenido">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Typography variant="h5">Últimos posts</Typography>
          <Button onClick={() => navigate("/feed/new-post")}>Nuevo</Button>
        </div>
        <div className="flex flex-col gap-10">
          {posts?.map((post) => (
            <PostTeaserProvider key={post.id} {...post} />
          ))}
        </div>
        <DataLoader
          isLoading={loadingPosts || isFetchingNextPage}
          hasData={!!posts?.length}
          retry={refetch}
          hasNextPage={hasNextPage}
          loadMore={fetchNextPage}
        />
        <FeedModals />
      </div>
    </Page>
  );
};

const PostTeaserProvider = (post: SocialTypes.Post) => {
  return <PostTeaser {...post} />;
};

const FeedModals = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/new-post"
        element={
          <ModalDrawer title="Nuevo post" onClose={() => navigate(-1)}>
            <PostForm />
          </ModalDrawer>
        }
      />
    </Routes>
  );
};

export default FeedPage;
