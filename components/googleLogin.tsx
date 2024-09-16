import { signIn } from "next-auth/react"; // Import signIn directly from next-auth/react
import { Button } from "@/components/ui/button";
import React from "react";
import { FcGoogle } from "react-icons/fc";

const GoogleSignIn = () => {
  const handleSignIn = async () => {
    await signIn("google");
  };

  return (
    <form className="w-full" onSubmit={(e) => e.preventDefault()}>
      <Button variant="outline" className="w-full" onClick={handleSignIn}>
        <FcGoogle className="mr-2 h-4 w-4" />
        Google
      </Button>
    </form>
  );
};

export default GoogleSignIn;
