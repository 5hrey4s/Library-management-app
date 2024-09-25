"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";
import { IProfessor } from "@/Models/professor.model";
import EditProfessor from "./ui/editProfessor";

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
}: {
  professors: IProfessor[];
  scheduledEvents: ScheduledEvent[];
  role: string;
}) {
  const [selectedProfessor, setSelectedProfessor] = useState<IProfessor | null>(
    null
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "canceled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        Professor Directory
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professors.map((professor) => (
          <Card
            key={professor.id}
            className="relative flex flex-col animate-fade-in-up border shadow-lg hover:shadow-xl transition-all duration-300 bg-card"
          >
            <CardHeader>
              {/* Edit button placed at the top right corner */}
              <div className="absolute top-2 right-2">
                {role == "admin" && <EditProfessor id={professor.id} />}
                {/* Edit Professor button */}
              </div>

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
              <Link
                href={`/home/professors/${professor.id}`}
                className="w-full"
              >
                <Button variant="default" className="w-full">
                  Book Appointment
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
