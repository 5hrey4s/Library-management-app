import * as React from "react";
import { ITransaction } from "@/Models/transaction.model";
import { Badge } from "@/components/ui/badge";
import { fetchTransaction } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarIcon, BookOpenIcon, ArrowLeftIcon } from "lucide-react";
import { SearchParams } from "@/app/home/books/page";
import { IPageRequest } from "@/core/pagination";
import { Button } from "@/components/ui/button";
import ReturnBookButton from "./ui/return";

interface TransactionsTableProps {
  searchParams: SearchParams;
  pageRequest: IPageRequest;
}

const TransactionsTable = async ({
  searchParams,
  pageRequest,
}: TransactionsTableProps) => {
  const { items: transactions } = await fetchTransaction(pageRequest);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-2xl font-semibold text-primary flex items-center">
          <BookOpenIcon className="mr-2 h-6 w-6" />
          My Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Book ID</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-14">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction: ITransaction) => (
                <TableRow key={transaction.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {transaction.bookId}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(transaction.issueDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(transaction.dueDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.Status === "Issued"
                          ? "default"
                          : "secondary"
                      }
                      className="font-semibold"
                    >
                      {transaction.Status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.Status === "Issued" && (
                      <ReturnBookButton id={transaction.id} className="bg-white text-black hover:bg-transparent">Return </ReturnBookButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <BookOpenIcon className="h-12 w-12 mb-2" />
                    <p>No transactions found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransactionsTable;
