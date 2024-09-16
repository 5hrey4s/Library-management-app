import { SearchParams } from "@/app/home/books/page";
import { IPageRequest } from "@/core/pagination";
import { fetchMembers } from "@/lib/data";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronUp, ChevronDown, Edit } from "lucide-react";

interface MemberTableProps {
  pageRequest: IPageRequest;
  searchParams: SearchParams;
}

const MemberTable: React.FC<MemberTableProps> = async ({
  pageRequest,
  searchParams,
}) => {
  const { items: members } = await fetchMembers(pageRequest);

  const sortColumn = (searchParams.sortColumn as keyof IMember) || "lastName";
  const sortOrder = searchParams.sortOrder === "desc" ? "desc" : "asc";
  const searchTerm = searchParams.searchTerm || "";
  const roleFilter = searchParams.role || "all";

  // Get unique roles
  const roles = Array.from(new Set(members.map((member) => member.role)));

  const sortedMembers = [...members].sort((a, b) => {
    if (a[sortColumn]! < b[sortColumn]!) return sortOrder === "asc" ? -1 : 1;
    if (a[sortColumn]! > b[sortColumn]!) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const filteredMembers = sortedMembers.filter(
    (member) =>
      (roleFilter === "all" || member.role === roleFilter) &&
      Object.values(member).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Member List</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Input
            name="searchTerm"
            placeholder="Search members..."
            defaultValue={searchTerm}
            className="w-full sm:w-64"
          />
          <div className="flex items-center gap-2">
            <Select name="sortColumn" defaultValue={sortColumn}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastName">Last Name</SelectItem>
                <SelectItem value="firstName">First Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="role">Role</SelectItem>
              </SelectContent>
            </Select>
            <Select name="sortOrder" defaultValue={sortOrder}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
            <Select name="role" defaultValue={roleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Apply</Button>
          </div>
        </form>

        <Table>
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
            {filteredMembers.map((member: IMember) => (
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
                        {member.lastName}, {member.firstName}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phoneNumber}</TableCell>
                <TableCell>
                  <Badge
                    variant={member.role === "Admin" ? "default" : "secondary"}
                  >
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <form action={`/admin/members/${member.id}/edit`}>
                    <Button variant="ghost" size="sm" type="submit">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredMembers.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            No members found matching your search criteria.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberTable;
