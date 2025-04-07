"use client";

import { createContext, useState } from "react";


type NoteProvideContextType = {
    noteText: string;
    setNoteText: (noteText: string) => void;
}


export const NoteProvideContext = createContext<NoteProvideContextType>({
    noteText: "",
    setNoteText: () => {},
});

function NoteProvider({children}: {children: React.ReactNode}) {
    const [noteText, setNoteText] = useState("");

    return (
        <NoteProvideContext.Provider value={{noteText, setNoteText}}>
            {children}
        </NoteProvideContext.Provider>
    )
}

export default NoteProvider;