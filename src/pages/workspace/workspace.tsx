import DropzoneWrapper from "@/components/DropzoneWrapper";
import { FileCard } from "@/components/file-card";
import { Spinner } from "@/components/ui/spinner";
import { useFiles } from "@/hooks/use-files";

export default function Workspace() {
  const { data, isLoading } = useFiles();

  if (isLoading)
    return <Spinner className="absolute top-1/2 left-1/2 size-8" />;

  return (
    <DropzoneWrapper>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-5 p-4 flex-1">
        {data?.map((file) => (
          <FileCard file={file} key={file.id} />
        ))}
      </div>
    </DropzoneWrapper>
  );
}
