import { useState } from "react";
import {
  CommentOutlined,
  Favorite,
  FavoriteBorder,
  Image,
  Person,
} from "@mui/icons-material";

import { socialService } from "services";
import { useActiveUser } from "store";
import { Id } from "types/apiTypes";

const PostCounters = (props: {
  comments?: number;
  likes?: number;
  postId: Id;
}) => {
  const [syncLike, setSyncLike] = useState(0);
  const { activeUser } = useActiveUser();
  const { data: like, refetch } = socialService.useLike(
    activeUser?.id,
    props.postId
  );
  const { mutate: createLike } = socialService.useCreateLike();
  const { mutate: deleteLike } = socialService.useRemoveLike();

  const onLikeClick = () => {
    if (activeUser?.id && props.postId) {
      if (like?.id) {
        deleteLike(like.id, {
          onSuccess: () => {
            refetch();
            setSyncLike(syncLike - 1);
          },
        });
      } else {
        createLike(
          {
            post: props.postId,
            createdBy: activeUser.id,
          },
          {
            onSuccess: () => {
              refetch();
              setSyncLike(syncLike + 1);
            },
          }
        );
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-2">
        {props.comments || 0}
        <CommentOutlined />
      </span>
      <span className="flex items-center gap-2">
        {(props.likes || 0) + syncLike}
        {!like?.id ? (
          <FavoriteBorder className="cursor-pointer" onClick={onLikeClick} />
        ) : (
          <Favorite className="cursor-pointer" onClick={onLikeClick} />
        )}
      </span>
    </div>
  );
};

const GoalCounters = (props: { participants?: number; posts?: number }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-2">
        {props.participants || 0}
        <Person />
      </span>
      <span className="flex items-center gap-2">
        {props.posts || 0}
        <Image />
      </span>
    </div>
  );
};

const UserCounters = (props: { followers?: number; posts?: number }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-2">
        {props.followers || 0}
        <Person />
      </span>
      <span className="flex items-center gap-2">
        {props.posts || 0}
        <Image />
      </span>
    </div>
  );
};

export { PostCounters, GoalCounters, UserCounters };
