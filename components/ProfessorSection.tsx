"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IProfessor } from "@/Models/professor.model";
import EditProfessor from "@/components/ui/editProfessor";
import { Search, BookOpen, X } from "lucide-react";
import { refreshCalendlyLink } from "@/lib/actions";
import BuyProduct from "./razorpay/BuyProduct";
import { IMember } from "@/Models/member.model";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ScheduledEvent {
  name: string;
  start_time: string;
  end_time: string;
  status: string;
}

export default function ProfessorSection({
  professors,
  scheduledEvents,
  role,
  user,
}: {
  professors: IProfessor[];
  scheduledEvents: ScheduledEvent[];
  role: string;
  user: IMember;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [credit, setCredit] = useState(user.credits);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRefresh = async (email: string) => {
    await refreshCalendlyLink(email);
  };

  const departments = useMemo(() => {
    return Array.from(new Set(professors.map((p) => p.department)));
  }, [professors]);

  const filteredProfessors = useMemo(() => {
    return professors.filter(
      (professor) =>
        professor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDepartment === "all" ||
          professor.department === selectedDepartment)
    );
  }, [professors, searchTerm, selectedDepartment]);

  const handleBookAppointment = (professorId: string) => {
    if (credit <= 0) {
      setIsModalOpen(true);
    } else {
      // Navigate to appointment booking page
      window.location.href = `/${
        role === "admin" ? "admin" : "home"
      }/professors/${professorId}`;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        Professor Directory
      </h2>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search professors..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={selectedDepartment}
          onValueChange={setSelectedDepartment}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessors.map((professor) => (
          <Card
            key={professor.id}
            className="flex flex-col animate-fade-in-up border shadow-lg hover:shadow-xl transition-all duration-300 bg-card"
          >
            <CardHeader className="relative">
              {role === "admin" && (
                <div className="absolute top-2 right-2">
                  <EditProfessor id={professor.id} />
                </div>
              )}
              <CardTitle className="text-xl font-bold">
                {professor.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {professor.department}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm line-clamp-3">{professor.bio}</p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              {professor.calendlyLink && (
                <Button
                  variant="default"
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => handleBookAppointment(String(professor.id))}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
              )}
              {role === "admin" && !professor.calendlyLink && (
                <Button
                  variant="default"
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => handleRefresh(professor.email)}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      {filteredProfessors.length === 0 && (
        <p className="text-center text-muted-foreground mt-6">
          No professors found matching your search criteria.
        </p>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Insufficient Credits</DialogTitle>
            <DialogDescription>
              You need at least 1 credit to book an appointment. Would you like
              to purchase credits?
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <BuyProduct user={user} onCreditUpdate={setCredit} />
          </div>
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(false)}
            className="mt-2"
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
