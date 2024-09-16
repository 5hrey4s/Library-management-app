import * as React from "react";
import { ITransaction } from "@/Models/transaction.model";
import { Badge } from "@/components/ui/badge";
import { MemberRepository } from "@/Repositories/member.repository";
import { auth } from "@/auth";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { IMember } from "@/Models/member.model";
import { fetchMyTransactions } from "@/lib/data";
import ReturnBookButton from "./ui/return";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

// Initialize database connection
const pool = mysql.createPool(
  "mysql://root:root_password@localhost:3306/librarydb"
);
const db = drizzle(pool);
const memberRepository = new MemberRepository(db);

interface MyTransactionsTableProps{
  searchParams:SearchParams
}

const MyTransactionsTable = async ({ searchParams }:MyTransactionsTableProps) => {
  const session = await auth();
  const email = session?.user?.email;

  // Fetch the current user based on email
  const user: IMember | null = await memberRepository.getByEmail(email!);

  // Fetch transactions for the logged-in user
  const transactions: ITransaction[] = await fetchMyTransactions(user!.id);

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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">
          My Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              name="search"
              placeholder="Search transactions..."
              className="pl-8 pr-4 py-2 w-full"
              defaultValue={searchParams.search || ""}
            />
          </div>
          <Select name="status" defaultValue={filterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Issued">Issued</SelectItem>
              <SelectItem value="Returned">Returned</SelectItem>
            </SelectContent>
          </Select>
            <Button type="submit" className="bg-[#2f8d46] hover:bg-[#256f38]">Apply Filters</Button>
        </form>

        <div className="overflow-x-auto">
          <Table>
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
