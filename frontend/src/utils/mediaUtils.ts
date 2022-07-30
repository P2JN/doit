import { BASE_URL } from "services/config";

const mediaUtils = {
  sanitizeMediaUrl: (url: string) => {
    return BASE_URL + "/" + url;
  },
};

export default mediaUtils;
