"use client";

import React, { useState } from "react";
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
import { CalendarIcon, BookOpenIcon, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useRouter } from "next/navigation";

interface TransactionsTableClientProps {
  initialTransactions: ITransaction[];
  initialSearchParams: {
    search?: string;
    status?: string;
  };
}

const TransactionsTableClient: React.FC<TransactionsTableClientProps> = ({
  initialTransactions,
  initialSearchParams,
}) => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchTerm, setSearchTerm] = useState(initialSearchParams.search || "");
  const [statusFilter, setStatusFilter] = useState(initialSearchParams.status || "all");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    filterTransactions();
  };

  const filterTransactions = () => {
    const filtered = initialTransactions.filter((transaction) => {
      const matchesSearch =
        String(transaction.bookId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(transaction.issueDate).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(transaction.dueDate).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || transaction.Status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setTransactions(filtered);
  };

  const handleReturnBook = async (transactionId: number) => {
    try {
      await fetch(`/api/transactions/${transactionId}/return`, { method: 'POST' });
      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error("Error returning book:", error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex items-center space-x-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              name="search"
              placeholder="Search transactions..."
              className="pl-8 pr-4 py-2 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Issued">Issued</SelectItem>
              <SelectItem value="Returned">Returned</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </form>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Book ID</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((transaction: ITransaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.bookId}</TableCell>
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
                        variant={transaction.Status === "Issued" ? "default" : "secondary"}
                        className="font-semibold"
                      >
                        {transaction.Status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.Status === "Issued" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Return Book
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Book Return</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to return this book? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction asChild>
                                <Button
                                  variant="default"
                                  onClick={() => handleReturnBook(transaction.id)}
                                >
                                  Confirm Return
                                </Button>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <BookOpenIcon className="h-12 w-12 mb-2" />
                      <p className="text-lg font-medium">No transactions found</p>
                      <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
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

export default TransactionsTableClient;