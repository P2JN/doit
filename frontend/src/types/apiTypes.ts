export type Id = number | string;

export type PagedList<ItemType> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ItemType[];
};
