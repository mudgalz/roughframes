import type { FeedbackRow } from "@/lib/types";
import { useFeedbackDraftStore } from "../../hooks/use-feedback-draft";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useFeedbackMutation } from "@/hooks/use-feedback";
import { cn, formatDate } from "@/lib/utils";
import { MoreVertical } from "lucide-react";

interface Props {
  feedback: FeedbackRow;
}

export default function FeedbackItem({ feedback }: Props) {
  const { openExisting, activeFeedback, resetAll } = useFeedbackDraftStore();
  const { remove, update } = useFeedbackMutation(feedback.file_id);

  const handleEdit = () => {
    // openExisting(feedback);
  };

  const handleDelete = () => {
    remove.mutate(feedback.id);
  };

  const handleSelect = () => {
    if (!hasAnnotations) return;

    if (activeFeedback?.id === feedback.id) {
      resetAll();
    } else {
      openExisting(feedback);
    }
  };

  const hasAnnotations = feedback.annotations?.length > 0;
  const isActive = activeFeedback?.id === feedback.id;

  return (
    <Card
      onClick={handleSelect}
      className={cn(
        "group relative transition-all duration-100",
        hasAnnotations && "cursor-pointer",
        hasAnnotations &&
          !isActive &&
          "hover:ring-1 hover:ring-muted-foreground/40",
        isActive && "ring-2 ring-emerald-500"
      )}>
      <CardHeader className="flex items-center justify-between">
        <Avatar className="justify-self-start">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {feedback.added_by?.charAt(0) ?? "A"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2 items-center">
          <p className="text-sm font-semibold leading-none">
            {feedback.added_by || "Anonymous"}
          </p>
          <time className="text-xs text-muted-foreground">
            {formatDate(feedback.created_at)}
          </time>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity ${
                remove.isPending ? "opacity-100 pointer-events-none" : ""
              }`}>
              {remove.isPending ? (
                <Spinner />
              ) : (
                <MoreVertical className="size-4 " />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive hover:text-destructive focus:text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
              onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      {/* COMMENT */}
      <CardContent className="pt-0 space-y-2">
        <p className="text-sm leading-relaxed text-foreground">
          {feedback.comment}
        </p>
      </CardContent>
    </Card>
  );
}
