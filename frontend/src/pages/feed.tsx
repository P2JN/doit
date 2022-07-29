import { useEffect } from "react";
import { Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Typography } from "@mui/material";

import { Page } from "layout";
import { socialService } from "services";
import { useActiveUser } from "store";
import { SocialTypes } from "types";

import { DataLoader } from "components/molecules";
import { ModalDrawer, PostTeaser } from "components/organisms";
import { PostForm } from "components/templates";

const FeedPage = () => {
  const { activeUser } = useActiveUser();

  const {
    data: postList,
    isLoading: loadingPosts,
    refetch,
  } = socialService.useFeedPosts(activeUser?.id);

  const navigate = useNavigate();

  const [params] = useSearchParams();
  useEffect(() => {
    if (params.get("refresh") === "feed") refetch();
  }, [params, refetch]);

  return (
    <Page title="Feed">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Typography variant="h5">Últimos posts</Typography>
          <Button onClick={() => navigate("/feed/new-post")}>Nuevo</Button>
        </div>
        <DataLoader
          isLoading={loadingPosts}
          hasData={!!postList?.results?.length}
          retry={refetch}
        />
        <div className="flex flex-col gap-10">
          {postList?.results?.map((post) => (
            <PostTeaserProvider key={post.id} {...post} />
          ))}
        </div>
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
