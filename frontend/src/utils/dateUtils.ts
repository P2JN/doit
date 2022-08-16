const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

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
  beautifyMonth: (month?: number) => {
    if (!month) return "";
    return months[month - 1];
  },
  ISODateOnly: (date?: Date) => {
    if (!date) {
      return "";
    }
    return date.toISOString().split("T")[0];
  },
  ISODatePlusOneWeek: (date?: string) => {
    if (!date) {
      return "";
    }
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + 7);
    return dateUtils.ISODateOnly(dateObj);
  },
  ISODateMinusOneWeek: (date?: string) => {
    if (!date) {
      return "";
    }
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() - 7);
    return dateUtils.ISODateOnly(dateObj);
  },
};

export default dateUtils;
