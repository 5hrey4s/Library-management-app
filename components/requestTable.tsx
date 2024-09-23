"use client";
import React from "react";
import { SearchParams } from "@/app/[locale]/home/books/page";
import { IRequest } from "@/Models/request.model";
import { Button } from "@/components/ui/button";
import { AprroveButton, RejectButton } from "@/components/ui/buttons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, BookIcon, UserIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PaginationControls from "./PaginationControls";

interface RequestTableProps {
  pagination: { limit: number; offset: number; total: number };
  searchParams: SearchParams;
  items: IRequest[];
}

const RequestTable: React.FC<RequestTableProps> = ({
  pagination,
  searchParams,
  items,
}) => {
  const page = parseInt(searchParams["page"] ?? "1");
  const perPage = parseInt(searchParams["per_page"] ?? "8");
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="px-6 py-4">
        <CardTitle className="text-2xl font-semibold text-primary">
          Request List
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4 text-left">Book ID</TableHead>
              <TableHead className="w-1/4 text-left">Member ID</TableHead>
              <TableHead className="w-1/4 text-left">Status</TableHead>
              <TableHead className="w-1/4 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <BookIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {request.bookId}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {request.memberId}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-semibold">
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-center items-center">
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
                            {/* <AprroveButton
                              data={{
                                id: request.id,
                                bookId: request.bookId,
                                memberId: request.memberId,
                                status: "Approved",
                              }}
                            /> */}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            {/* <RejectButton
                              data={{
                                id: request.id,
                                bookId: request.bookId,
                                memberId: request.memberId,
                                status: "Rejected",
                              }}
                            /> */}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No pending requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <PaginationControls
          hasNextPage={end < items.length}
          hasPrevPage={start > 0}
          totalPages={Math.ceil(items.length / perPage)}
        />
      </CardContent>
    </Card>
  );
};

export default RequestTable;
