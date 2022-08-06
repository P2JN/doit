const dateUtils = {
  beautifyDate: (date?: string) => {
    if (!date) {
      return "";
    }

    const dateObj = new Date(date);
    const now = new Date();

    if (now.getTime() - dateObj.getTime() < 60000) {
      return "justo ahora";
    } else if (now.getTime() - dateObj.getTime() < 3600000) {
      return `hace ${Math.floor(
        (now.getTime() - dateObj.getTime()) / 60000
      )} min`;
    } else if (now.getTime() - dateObj.getTime() < 86400000) {
      return `hace ${Math.floor(
        (now.getTime() - dateObj.getTime()) / 3600000
      )} horas`;
    } else if (dateObj.getDate() === now.getDate() - 1) {
      return "ayer";
    } else {
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    }
  },
};

export default dateUtils;
