import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Alert, Button, CircularProgress, Typography } from "@mui/material";

import { Page } from "layout";
import { socialService } from "services";
import { useActiveUser } from "store";
import { SocialTypes } from "types";

import { PostTeaser } from "components/organisms";

const FeedPage = () => {
  const { activeUser } = useActiveUser();

  const {
    data: posts,
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
          <Button onClick={() => navigate("/feed/new-post")}>
            <strong>Nuevo</strong>
          </Button>
        </div>
        {loadingPosts && <CircularProgress />}
        {!loadingPosts && !posts?.length && (
          <Alert
            severity="info"
            className="my-7"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Reintentar
              </Button>
            }
          >
            No se han encontrado posts,{" "}
            <Link to="/explore" className="font-bold">
              explora
            </Link>{" "}
            y encuentra a alguien a quien seguir.
          </Alert>
        )}
        <div className="flex flex-col gap-10">
          {posts?.map((post) => (
            <PostTeaserProvider {...post} />
          ))}
        </div>
      </div>
    </Page>
  );
};

const PostTeaserProvider = (post: SocialTypes.Post) => {
  return <PostTeaser {...post} />;
};

export default FeedPage;
