import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { confirm } from "@/hooks/use-confirm";
import { useUser } from "@/hooks/use-user";
import { deleteAllFiles } from "@/lib/db";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import FileUploadButton from "./FIleUploadButton";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";

export const WorkspaceHeader = () => {
  const user = useUser((s) => s.user);
  const clearUser = useUser((s) => s.clearUser);
  const navigate = useNavigate();

  const logout = () => {
    clearUser();
    navigate("/identify", { replace: true });
  };

  const handleDeleteAllFiles = async () => {
    const pwd = await confirm({
      title: "Delete all records from database?",
      prompt: "Enter admin password",
    });

    if (!pwd) return;

    try {
      await deleteAllFiles(pwd as string);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <header className="flex items-center justify-between border-b bg-card px-4 py-2">
      <div className="flex items-center">
        <span className="font-semibold text-base">Home</span>
      </div>

      <div className="flex items-center gap-4 **:data-[slot=separator]:!h-5">
        <FileUploadButton />

        <Popover>
          <PopoverTrigger>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback className="text-xs">
                <User size={18} />
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>

          <PopoverContent align="end" className="w-44 p-3">
            <div className="flex flex-col gap-3">
              <div className="text-sm">
                <p className="font-medium">{user?.name}</p>
              </div>

              <Button variant="outline" size={"sm"} onClick={logout}>
                Reset Identity
              </Button>
              <Separator />
              <Button
                onClick={handleDeleteAllFiles}
                className="text-rose-500"
                variant={"link"}>
                Delete Everything
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};
