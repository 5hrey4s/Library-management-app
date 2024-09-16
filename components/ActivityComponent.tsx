import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { BookOpen, BookMarked, CalendarIcon } from "lucide-react"

export interface ITransactionBase {
  memberId: number;
  bookId: number;
}

export interface ITransaction extends ITransactionBase {
  id: number;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  Status: TStatus;
}

type TStatus = "Issued" | "Returned";

interface ActivityComponentProps {
  transactions: ITransaction[];
}

export function ActivityComponent({ transactions }: ActivityComponentProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-8">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary bg-background">
                    {transaction.Status === "Issued" ? (
                      <BookOpen className="h-5 w-5 text-primary" />
                    ) : (
                      <BookMarked className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="w-px h-full bg-border" />
                </div>
                <div className="pb-8">
                  <div className="flex items-center mb-1">
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                    <time className="text-sm text-muted-foreground">
                      {new Date(transaction.Status === "Issued" ? transaction.issueDate : transaction.returnDate!).toLocaleDateString()}
                    </time>
                  </div>
                  <div className="mb-2">
                    <Badge variant={transaction.Status === "Issued" ? "default" : "secondary"}>
                      {transaction.Status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold">Book ID: {transaction.bookId}</h3>
                  <p className="text-sm text-muted-foreground">
                    {transaction.Status === "Issued" 
                      ? `Due Date: ${new Date(transaction.dueDate).toLocaleDateString()}`
                      : `Returned on: ${new Date(transaction.returnDate!).toLocaleDateString()}`
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}