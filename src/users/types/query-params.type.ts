import {
  IFilterAttributes,
  IOrder,
  ISortAttributes,
} from "../enums/query-params.enum";

export interface IGetUsersQuery {
  page: string;
  limit: string;
  sort: ISortAttributes;
  filter: IFilterAttributes;
  order: IOrder;
}
