import { useUploadFiles } from "@/hooks/use-files";
import { useRef } from "react";
import { Button } from "./ui/button";

export default function FileUploadButton() {
  const uploadMutation = useUploadFiles();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileList = Array.from(e.target.files);

    uploadMutation.mutate(fileList);

    // reset input so selecting the same file again works
    e.target.value = "";
  };

  return (
    <div>
      <Button
        title="Upload files — click or drop anywhere"
        size="sm"
        variant={"outline"}
        className="text-white text-xs transition-all active:scale-95"
        onClick={() => fileInputRef.current?.click()}>
        Upload
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        hidden
        multiple
        accept={"image/*,video/*"}
        onChange={handleFileInput}
      />
    </div>
  );
}
