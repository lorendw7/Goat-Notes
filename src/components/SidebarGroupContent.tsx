"use client";

import { Note } from "@prisma/client";
import {
  SidebarGroupContent as SidebarGroupContentShadCN,
  SidebarMenu,
  SidebarMenuItem,
} from "./ui/sidebar";
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import SelectNoteButton from "./SelectNoteButton";
import DeleteNoteButton from "./DeleteNoteButton";

type Props = {
  notes: Note[];
};

function SidebarGroupContent({ notes }: Props) {
  const [searchText, setSearchText] = useState("");
  const [localNotes, setLocalNotes] = useState(notes);

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const fuse = useMemo(() => {
    return new Fuse(localNotes, {
      keys: ["text"],
      threshold: 0.6,
    });
  }, [localNotes]);

  const filterNotes = searchText
    ? fuse.search(searchText).map((result) => result.item)
    : localNotes;

  const deleteNoteLocally = (noteId: string) => {
    setLocalNotes((prevNotes) =>
      prevNotes.filter((note) => note.id !== noteId)
    );
  };

  return (
    <SidebarGroupContentShadCN>
      <div className="relative flex items-center">
        <SearchIcon className="size-4 absolute left-2" />
        <Input
          value={searchText}
          placeholder="Search your notes...."
          onChange={(e) => setSearchText(e.target.value)}
          className="pl-8 bg-muted"
        />
      </div>
      <SidebarMenu className="mt-4">
        {filterNotes &&
          filterNotes.map((note) => (
            <SidebarMenuItem key={note.id} className="group/item">
              <SelectNoteButton note={note} />

              <DeleteNoteButton
                noteId={note.id}
                deleteNoteLocally={deleteNoteLocally}
              />
            </SidebarMenuItem>
          ))}
      </SidebarMenu>
    </SidebarGroupContentShadCN>
  );
}

export default SidebarGroupContent;
