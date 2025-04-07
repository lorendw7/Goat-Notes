"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/users";

function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    setLoading(true);

    const errorMessage = await logoutAction();
    console.log(errorMessage);
    if (!errorMessage.errorMessage) {
      toast.success("Logged Out", {
        description: "You have been successfully logged out",
      });
      router.replace("/");
    } else {
      toast.error("Error", {
        description: errorMessage.errorMessage,
      });
    }
    setLoading(false);
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogOut}
      disabled={loading}
      className="w-24"
    >
      {loading ? <Loader2 className="animate-spin" /> : "Log Out"}
    </Button>
  );
}

export default LogoutButton;
