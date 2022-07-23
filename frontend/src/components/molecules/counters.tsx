import {
  CommentOutlined,
  FavoriteBorder,
  Image,
  Person,
} from "@mui/icons-material";

import { Id } from "types/apiTypes";

const PostCounters = (props: {
  comments: number;
  likes: number;
  postId: Id;
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-2">
        {props.comments}
        <CommentOutlined />
      </span>
      <span className="flex items-center gap-2">
        {props.likes}
        <FavoriteBorder />
      </span>
    </div>
  );
};

const GoalCounters = (props: { participants: number; posts: number }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-2">
        {props.participants}
        <Person />
      </span>
      <span className="flex items-center gap-2">
        {props.posts}
        <Image />
      </span>
    </div>
  );
};

const UserCounters = (props: { followers: number; posts: number }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-2">
        {props.followers}
        <Person />
      </span>
      <span className="flex items-center gap-2">
        {props.posts}
        <Image />
      </span>
    </div>
  );
};

export { PostCounters, GoalCounters, UserCounters };
