import {
  CommentOutlined,
  FavoriteBorder,
  Image,
  Person,
} from "@mui/icons-material";

import { Id } from "types/apiTypes";

const PostCounters = (props: {
  comments?: number;
  likes?: number;
  postId: Id;
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-2">
        {props.comments || 0}
        <CommentOutlined />
      </span>
      <span className="flex items-center gap-2">
        {props.likes || 0}
        <FavoriteBorder />
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
