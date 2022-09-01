import { Route, Routes, useNavigate, useParams } from "react-router-dom";

import { socialService } from "services";
import { Page } from "layout";

import { DataLoader } from "components/molecules";
import { ModalDrawer, PostComments, PostTeaser } from "components/organisms";

const PostDetailPage = () => {
  const { postId } = useParams();
  const { data: post, isLoading, error } = socialService.usePost(postId);

  return (
    <Page title={post?.title || (isLoading ? "Buscando..." : "No encontrado")}>
      <div className="mt-4 flex flex-col gap-3 md:mt-0">
        {post && <PostTeaser {...post} />}
        <DataLoader isLoading={isLoading} hasData={!!post} error={error} />
      </div>
      <PostModals />
    </Page>
  );
};

const PostModals = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route
        path="/comments"
        element={
          <ModalDrawer title="Comentarios" onClose={() => navigate(-1)}>
            <PostComments />
          </ModalDrawer>
        }
      />
    </Routes>
  );
};

export default PostDetailPage;
