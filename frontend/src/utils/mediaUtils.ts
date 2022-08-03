import { BASE_URL } from "services/config";

const mediaUtils = {
  sanitizeMediaUrl: (url?: string) => {
    return url ? BASE_URL + "/" + url : url;
  },
};

export default mediaUtils;
