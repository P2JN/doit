import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Typography } from "@mui/material";

import { Page } from "layout";
import { socialService } from "services";
import { useActiveUser } from "store";
import { SocialTypes } from "types";

import { DataLoader } from "components/molecules";
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
        <DataLoader
          isLoading={loadingPosts}
          hasData={!!posts?.length}
          retry={refetch}
        />
        <div className="flex flex-col gap-10">
          {posts?.map((post) => (
            <PostTeaserProvider key={post.id} {...post} />
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
