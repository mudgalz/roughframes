import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { StaticLayout } from "./layouts/StaticLayout";
import { WorkspaceLayout } from "./layouts/WorkspaceLayout";

import Home from "./pages/home";

import Identify from "./pages/identify";
import FileViewer from "./pages/workspace/file-viewer";
import Workspace from "./pages/workspace/workspace";

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<StaticLayout />}>
        <Route index element={<Home />} />
        <Route path="/identify" element={<Identify />} />
      </Route>

      {/* Authenticated Workspace */}
      <Route path="/workspace" element={<ProtectedRoute />}>
        <Route element={<WorkspaceLayout />}>
          <Route index element={<Workspace />} />
        </Route>
        <Route path="file/:fileId" element={<FileViewer />} />
      </Route>
    </Routes>
  );
}
