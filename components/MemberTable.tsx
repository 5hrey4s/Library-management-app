"use client";
import { SearchParams } from "@/app/home/books/page";
import { IMember } from "@/Models/member.model";
import React from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronUp, ChevronDown, Edit } from "lucide-react";
import PaginationControls from "./PaginationControls";
import { useRouter, useSearchParams } from "next/navigation";
import EditButton from "./editButton";
import EditMemberButton from "./editButton";

interface MemberTableProps {
  pagination: { limit: number; offset: number; total: number };
  searchParams: SearchParams;
  items: IMember[];
}

const MemberTable: React.FC<MemberTableProps> = async ({
  pagination,
  searchParams,
  items,
}) => {
  // const { items: members } = await fetchMembers(pageRequest);
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  const sortColumn = (searchParams.sortColumn as keyof IMember) || "firstName";
  const sortOrder = searchParams.sortOrder === "desc" ? "desc" : "asc";
  const searchTerm = searchParams.searchTerm || "";
  const roleFilter = searchParams.role || "all";

  // Get unique roles
  const roles = ["admin", "user"];
  // Calculate start and end indices for pagination
  const page = parseInt(searchParams["page"] ?? "1");
  const perPage = parseInt(searchParams["per_page"] ?? "8");
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const newSearchParams = new URLSearchParams(currentSearchParams.toString());

    // Update only the changed params
    for (const [key, value] of formData.entries()) {
      if (value) {
        newSearchParams.set(key, value.toString());
      } else {
        newSearchParams.delete(key);
      }
    }

    router.replace(`/admin/members?${newSearchParams.toString()}`);
  };
  console.log(items);

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Member List</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleFormSubmit}
          className="mb-6 flex flex-col sm:flex-row justify-end items-center gap-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Select name="sortColumn" defaultValue={sortColumn}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="firstName">Last Name</SelectItem>
                <SelectItem value="lastName">First Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="role">Role</SelectItem>
              </SelectContent>
            </Select>
            <Select name="sortOrder" defaultValue={sortOrder}>
              <SelectTrigger className="w-full sm:w-[100px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit" className="w-full sm:w-auto">
              Apply
            </Button>
          </div>
        </form>

        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/5">Member</TableHead>
                <TableHead className="w-1/5">
                  <div className="flex items-center">
                    Email
                    {sortColumn === "email" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="ml-1" />
                      ) : (
                        <ChevronDown className="ml-1" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="w-1/5">Phone Number</TableHead>
                <TableHead className="w-1/5">
                  <div className="flex items-center">
                    Role
                    {sortColumn === "role" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="ml-1" />
                      ) : (
                        <ChevronDown className="ml-1" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="w-1/5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((member: IMember) => (
                <TableRow key={member.user_id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${member.firstName} ${member.lastName}`}
                        />
                        <AvatarFallback>
                          {member.firstName[0]}
                          {member.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold">
                          {member.firstName},{member.lastName}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phoneNumber}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        member.role === "Admin" ? "default" : "secondary"
                      }
                    >
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {/* <form action={`/admin/members/${member.user_id}/edit`}>
                      <Button variant="ghost" size="sm" type="submit">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </form> */}
                    <EditMemberButton id={member.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {items.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            No members found matching your search criteria.
          </p>
        )}
        <div className="mt-8 flex justify-center">
          <PaginationControls
            hasNextPage={end < pagination.total}
            hasPrevPage={start > 0}
            totalPages={Math.ceil(pagination.total / perPage)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberTable;
