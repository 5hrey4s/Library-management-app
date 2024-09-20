"use client";
import * as React from "react";
import { ITransaction } from "@/Models/transaction.model";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CalendarIcon, BookOpenIcon, Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SearchParams } from "@/app/home/books/page";
import { cancelBookRequest } from "@/lib/actions";

interface MyTransactionsTableProps {
  searchParams: SearchParams;
  transactions: ITransaction[];
}

const MyTransactionsTable = async ({
  searchParams,
  transactions,
}: MyTransactionsTableProps) => {
  // Server-side sorting and filtering
  const sortColumn =
    (searchParams.sortColumn as keyof ITransaction) || "issueDate";
  const sortOrder = searchParams.sortOrder === "desc" ? "desc" : "asc";
  const filterStatus = searchParams.status || "all";
  const searchTerm = searchParams.search || "";

  const filteredAndSortedTransactions = transactions
    .filter((transaction) => {
      const matchesStatus =
        filterStatus === "all" || transaction.Status === filterStatus;
      const matchesSearch =
        String(transaction.bookId)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        new Date(transaction.issueDate)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        new Date(transaction.dueDate)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (a[sortColumn]! < b[sortColumn]!) return sortOrder === "asc" ? -1 : 1;
      if (a[sortColumn]! > b[sortColumn]!) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">
          My Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              name="search"
              placeholder="Search transactions..."
              className="pl-8 pr-4 py-2 w-full"
              defaultValue={searchParams.search || ""}
            />
          </div>
          <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
            <Select name="status" defaultValue={filterStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Issued">Issued</SelectItem>
                <SelectItem value="Returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="bg-[#2f8d46] hover:bg-[#256f38] w-full sm:w-auto"
          >
            Apply Filters
          </Button>
        </form>

        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Book ID</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTransactions.length > 0 ? (
                filteredAndSortedTransactions.map(
                  (transaction: ITransaction) => (
                    <TableRow key={transaction.id}>
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
                        {transaction.Status === "Pending" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Cancel Request
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Confirm Book Cancel
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel this book?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction asChild>
                                  <Button
                                    variant="default"
                                    onClick={async () => {
                                      await cancelBookRequest(transaction.id);
                                    }}
                                  >
                                    Confirm Cancel
                                  </Button>
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        {/* {transaction.Status === "Pending" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Actions
                                <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <AprroveButton
                                  data={{
                                    id: transaction.id,
                                    Status: "Approved",
                                  }}
                                />
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <RejectButton id={transaction.id} />
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )} */}
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <BookOpenIcon className="h-12 w-12 mb-2" />
                      <p>No transactions found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyTransactionsTable;
