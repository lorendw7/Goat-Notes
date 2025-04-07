"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Fragment, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { askAIAboutNotesAction } from "@/actions/notes";
import "@/styles/ai-response.css";

type Props = {
  user: User | null;
};
const AskAIButton = ({ user }: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleOpenChange = (isOpen: boolean) => {
    if (!user) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      router.push(`${baseUrl}/login`);
    } else {
      if (isOpen) {
        setQuestionText("");
        setQuestions([]);
        setResponses([]);
      }
      setOpen(isOpen);
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style = "auto";
    textarea.style = `${textarea.scrollHeight}px`;
  };

  const handleCickInput = () => {
    textareaRef.current?.focus();
  };

  const handleSubmit = () => {
    if (!questionText.trim()) return;

    const newQuestions = [...questions, questionText];
    setQuestions(newQuestions);
    setQuestionText("");
    setTimeout(scrollBottom, 100);

    startTransition(async () => {
      const response = await askAIAboutNotesAction(newQuestions, responses);
      setResponses((prev) => [...prev, response]);

      setTimeout(scrollBottom, 100);
    });
  };

  const scrollBottom = () => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">Ask AI</Button>
      </DialogTrigger>
      <DialogContent
        className="custom-scrollbar flex h-[85vh] max-w-4xl flex-col overflow-y-auto"
        ref={contentRef}
      >
        <DialogHeader>
          <DialogTitle>Ask AI About Your Notes</DialogTitle>
          <DialogDescription>
            Now AI can answer questions about all of your notes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex mt-4 flex-col gap-8">
          {questions.map((question, index) => (
            <Fragment key={index}>
              <p className="bg-muted text-muted-foreground ml-auto max-w-[60%] rounded-md px-2 py-1 text-sm">
                {question}
              </p>
              {responses[index] && (
                <p
                  className="bot-response text-muted-foreground text-sm"
                  dangerouslySetInnerHTML={{ __html: responses[index] }}
                />
              )}
            </Fragment>
          ))}
          {isPending && <p className="animate-pulse text-sm">Thinking...</p>}
        </div>

        <div
          onClick={handleCickInput}
          className="mt-auto flex cursor-text flex-col rounded-lg border p-4"
        >
          <Textarea
            ref={textareaRef}
            placeholder="Ask me about your notes..."
            className="placeholder:text-shadow-muted-foreground resize-none
             border-none bg-transparent p-0 shadow-none focus-visible:ring-0
             focus-visible:ring-offset-0"
            style={{
              minHeight: 0,
              lineHeight: "normal",
            }}
            rows={1}
            value={questionText}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          <Button className="size-8 rounded-full ml-auto">
            <ArrowUpIcon className="text-background" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AskAIButton;
