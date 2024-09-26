"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CalendlyEmbed from "@/components/CalendlyEmbed";

interface UserAppointment {
  event: string;
  status: string;
  start_time: string;
  end_time: string;
  meetLink: string;
  cancelLink: string;
  rescheduleLink: string;
  organizers: string[];
  type: string;
  invitees: Invitee[];
}

interface Invitee {
  name: string;
  email: string;
}

export default function UserAppointments({
  userAppointments,
}: {
  userAppointments: UserAppointment[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    type: "cancel" | "reschedule";
    link: string;
  } | null>(null);

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
      case "confirmed":
        return "bg-green-500";
      case "canceled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAction = (type: "cancel" | "reschedule", link: string) => {
    setSelectedAction({ type, link });
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">View My Appointments</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-2">
              My Appointments
            </DialogTitle>
            <DialogDescription>
              Here are all your scheduled appointments.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            {userAppointments.length > 0 ? (
              userAppointments.map((appointment, index) => (
                <Card key={index} className="mb-4 last:mb-0">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-lg mb-2">
                      {appointment.event}
                    </h4>
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(appointment.start_time)}</span>
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{`${
                          formatDate(appointment.start_time).split(",")[1]
                        } - ${
                          formatDate(appointment.end_time).split(",")[1]
                        }`}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{appointment.type}</span>
                      </div>
                      <div className="flex items-center">
                        <Badge
                          className={`${getStatusColor(
                            appointment.status
                          )} text-white`}
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <Separator />
                  <CardFooter className="p-4 flex justify-between">
                    {appointment.meetLink && (
                      <Button
                        variant="link"
                        asChild
                        className={`p-0 h-auto font-normal text-primary ${
                          appointment.status === "canceled" ? "disabled" : ""
                        }`}
                        disabled={appointment.status === "canceled"} // Conditionally disable the button
                      >
                        <a
                          href={
                            appointment.status === "canceled"
                              ? "#"
                              : appointment.meetLink
                          } // Disable the link by setting href to "#"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            if (appointment.status === "canceled") {
                              e.preventDefault(); // Prevent navigation if the appointment is canceled
                            }
                          }}
                        >
                          Join Meeting
                        </a>
                      </Button>
                    )}
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleAction("reschedule", appointment.rescheduleLink)
                        }
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleAction("cancel", appointment.cancelLink)
                        }
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                You have no scheduled appointments.
              </p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Calendly Embed Dialog */}
      <Dialog
        open={!!selectedAction}
        onOpenChange={() => setSelectedAction(null)}
      >
        <DialogContent className="sm:max-w-[600px] h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedAction?.type === "cancel"
                ? "Cancel Appointment"
                : "Reschedule Appointment"}
            </DialogTitle>
          </DialogHeader>
          {selectedAction && (
            <CalendlyEmbed calendlyLink={selectedAction.link} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
