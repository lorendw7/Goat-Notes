"use client";

import { User } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createNoteAction } from "@/actions/notes";

type Props = {
  user: User | null;
};

const NewNoteButton = ({ user }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClickNewNoteButton = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!user) {
      router.push(`${baseUrl}/login`);
    } else {
      setLoading(true);
      const uuid = uuidv4();
      await createNoteAction(uuid);
      router.push(`${baseUrl}/?noteId=${uuid}`);
      toast.success("New Note Created");
      setLoading(false);
    }
  };
  return (
    <Button
      variant="secondary"
      className="w-24"
      onClick={handleClickNewNoteButton}
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : "New Note"}
    </Button>
  );
};

export default NewNoteButton;
