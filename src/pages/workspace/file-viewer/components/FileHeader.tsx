import { Button } from "@/components/ui/button";
import type { FileRow } from "@/lib/types";
import { ArrowLeft, PanelLeft, PanelRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFeedbackPanel } from "../hooks/use-feedback-panel";

export default function FileHeader(props: { file: FileRow }) {
  const { isOpen, toggle } = useFeedbackPanel();
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/workspace");
  };
  const file = props.file;
  return (
    <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
      <div className="flex items-center gap-2">
        <Button onClick={handleBack} size={"icon"} variant={"ghost"}>
          <ArrowLeft />
        </Button>
        <h1>
          {file.filename}.{file.format}
        </h1>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={toggle}
        className="flex items-center gap-2 ml-4">
        {isOpen ? <PanelLeft size={18} /> : <PanelRight size={18} />}
      </Button>
    </div>
  );
}
