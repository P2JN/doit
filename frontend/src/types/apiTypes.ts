export type Id = number | string;

export type PagedList<ItemType> = {
  count: number;
  next: string;
  previous: string;
  results: ItemType[];
};
