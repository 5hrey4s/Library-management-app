export interface ITransactionBase {
  memberId: number;
  bookId: number;
}

export interface ITransaction extends ITransactionBase {
  id: number;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  Status: string;
}

type TStatus = "Issued" | "Returned";
