import GlobalUploadPanel from "@/components/global-upload-panel";
import { WorkspaceHeader } from "@/components/WorkspaceHeader";
import { Outlet } from "react-router-dom";

export const WorkspaceLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex flex-1 flex-col">
        <WorkspaceHeader />
        <main className="flex-1 overflow-y-auto custom-scroll">
          <Outlet />
        </main>
      </div>
      <GlobalUploadPanel />
    </div>
  );
};
