const dateUtils = {
  beautifyDate: (date?: string) => {
    if (!date) {
      return "";
    }

    const dateObj = new Date(date);
    const now = new Date();

    if (now.getTime() - dateObj.getTime() < 60000) {
      return "just now";
    } else if (now.getTime() - dateObj.getTime() < 3600000) {
      return `${Math.floor(
        (now.getTime() - dateObj.getTime()) / 60000
      )} min ago`;
    } else if (now.getTime() - dateObj.getTime() < 86400000) {
      return `${Math.floor(
        (now.getTime() - dateObj.getTime()) / 3600000
      )} hours ago`;
    } else if (dateObj.getDate() === now.getDate() - 1) {
      return "yesterday";
    } else {
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    }
  },
};

export default dateUtils;
