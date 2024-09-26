import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedAccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <ShieldAlert className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Unauthorized Access</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">
            We're sorry, but you don't have permission to access this page. If you believe this is an error, please contact your administrator.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="javascript:history.back()">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          <p>If you need assistance, please contact our support team.</p>
        </CardFooter>
      </Card>
    </div>
  )
}