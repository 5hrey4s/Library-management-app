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

export default function ProfessorSection({
  professors,
}: {
  professors: IProfessor[];
}) {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {professors.map((professor) => (
          <Card
            key={professor.id}
            className="animate-fade-in-up border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-indigo-50 dark:bg-gray-700"
          >
            <CardHeader>
              <CardTitle>{professor.name}</CardTitle>
              <CardDescription>{professor.department}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{professor.bio}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/dashboard/professors/${professor.id}`}>
                <Button
                  variant="destructive"
                  className="w-full bg-black text-white"
                >
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
