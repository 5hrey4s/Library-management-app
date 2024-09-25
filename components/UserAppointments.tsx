'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react'

interface UserAppointment {
  calendar_event: { external_id: string; kind: string }
  created_at: string
  end_time: string
  event_type: string
  invitees_counter: { active: number; limit: number; total: number }
  location: { join_url: string; status: string; type: string }
  name: string
  start_time: string
  status: string
  uri: string
}

export default function UserAppointments({ userAppointments }: { userAppointments: UserAppointment[] }) {
  const [isOpen, setIsOpen] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500'
      case 'canceled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View My Appointments</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">My Appointments</DialogTitle>
          <DialogDescription>
            Here are all your scheduled appointments.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {userAppointments.length > 0 ? (
            userAppointments.map((appointment, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg last:mb-0 hover:bg-accent transition-colors duration-200">
                <h4 className="font-semibold text-lg mb-2">{appointment.name}</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(appointment.start_time)}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{`${formatDate(appointment.start_time).split(',')[1]} - ${formatDate(appointment.end_time).split(',')[1]}`}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{appointment.location.type}</span>
                  </div>
                  <div className="flex items-center">
                    <Badge className={`${getStatusColor(appointment.status)} text-white`}>
                      {appointment.status}
                    </Badge>
                  </div>
                  {appointment.location.join_url && (
                    <a href={appointment.location.join_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Join Meeting
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">You have no scheduled appointments.</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
} 