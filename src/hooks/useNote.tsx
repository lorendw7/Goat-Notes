"use client";

import { NoteProvideContext } from "@/providers/NoteProvider";
import { useContext } from "react";

const useNote = () => {
  const context = useContext(NoteProvideContext);

  if (!context) throw new Error("useNote must be used within a NoteProvider");
  return context;
};

export default useNote;
