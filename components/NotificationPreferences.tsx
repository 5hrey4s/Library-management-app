"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function NotificationPreferences() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="email-notifications" className="flex items-center space-x-2 text-[#333]">
          <span>Email Notifications</span>
        </Label>
        <Switch
          id="email-notifications"
          checked={emailNotifications}
          onCheckedChange={setEmailNotifications}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="push-notifications" className="flex items-center space-x-2 text-[#333]">
          <span>Push Notifications</span>
        </Label>
        <Switch
          id="push-notifications"
          checked={pushNotifications}
          onCheckedChange={setPushNotifications}
        />
      </div>
    </div>
  )
}