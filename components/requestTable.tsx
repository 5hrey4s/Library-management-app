"use client";

import React from "react";
import { SearchParams } from "@/app/home/books/page";
import { IPageRequest } from "@/core/pagination";
import { IRequest } from "@/Models/request.model";
import { fetchRequests } from "@/lib/data";
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

interface RequestTableProps {
  pageRequest: IPageRequest;
  searchParams: SearchParams;
}

const RequestTable: React.FC<RequestTableProps> = ({
  pageRequest,
  searchParams,
}) => {
  const [requests, setRequests] = React.useState<IRequest[]>([]);

  React.useEffect(() => {
    const loadRequests = async () => {
      const { items } = await fetchRequests(pageRequest);
      setRequests(
        items.filter((request: IRequest) => request.status === "Pending")
      );
    };
    loadRequests();
  }, [pageRequest]);

  return (
    <Card className="w-full">
      <CardHeader className="px-6 py-4">
        {/* <CardTitle className="text-2xl font-semibold text-primary">
          Request List
        </CardTitle> */}
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
            {requests.length > 0 ? (
              requests.map((request) => (
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
                            <AprroveButton
                              data={{
                                id: request.id,
                                bookId: request.bookId,
                                memberId: request.memberId,
                                status: "Approved",
                              }}
                            />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <RejectButton
                              data={{
                                id: request.id,
                                bookId: request.bookId,
                                memberId: request.memberId,
                                status: "Rejected",
                              }}
                            />
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
      </CardContent>
    </Card>
  );
};

export default RequestTable;
