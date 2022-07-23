// splits an array @list into chunks of size @size
const arrayUtils = {
  chunk: (list: any[], size: number) => {
    const chunks = [];
    for (let i = 0; i < list.length; i += size) {
      chunks.push(list.slice(i, i + size));
    }
    return chunks;
  },
};

export default arrayUtils;
