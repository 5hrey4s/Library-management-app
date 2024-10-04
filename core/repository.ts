import { MemberSortOptions, PaymentSortOptions, SortOptions, TransactionSortOptions } from "@/lib/data";
import { IPageRequest, IPagesResponse } from "./pagination";

export interface IRepository<
  MutationModel,
  CompleteModel extends MutationModel
> {
  create(data: MutationModel): Promise<CompleteModel | null>;
  update(id: number, data: MutationModel): Promise<CompleteModel | null>;
  delete(id: number): Promise<CompleteModel | null>;
  getById(id: number): Promise<CompleteModel | null>;
  list(
    params: IPageRequest,
    sortOptions?: SortOptions | MemberSortOptions | TransactionSortOptions | PaymentSortOptions
  ): Promise<IPagesResponse<CompleteModel>>;
}
