import {
  CheckCircle,
  Comment,
  CrisisAlert,
  Favorite,
  Image,
  Info,
  PersonAdd,
  TrackChanges,
} from "@mui/icons-material";

import { SocialTypes } from "types";

const NotificationIcon = (props: {
  icon: SocialTypes.NotificationIconType;
}) => {
  switch (props.icon) {
    case "like":
      return <Favorite />;
    case "comment":
      return <Comment />;
    case "completed":
      return <CheckCircle />;
    case "goal":
      return <CrisisAlert />;
    case "post":
      return <Image />;
    case "follow":
      return <PersonAdd />;
    case "tracking":
      return <TrackChanges />;

    case "info":
    default:
      return <Info />;
  }
};

export default NotificationIcon;
