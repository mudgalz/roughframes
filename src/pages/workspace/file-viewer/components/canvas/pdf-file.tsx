import * as pdfjs from "pdfjs-dist";
import React, { useCallback, useEffect, useState } from "react";
import type { Annotation } from "../../types";

import { Spinner } from "@/components/ui/spinner";
import "pdfjs-dist/build/pdf.worker.min.mjs";
import { usePdfStore } from "../../hooks/use-pdf-store";
import { KanvasToolbar } from "../KanvasToolbar";
import ImageKanvas from "./Imagekanvas";

export interface PdfFileProps {
  pdfUrl: string;
  annotations: Annotation[];
}

const PdfFile: React.FC<PdfFileProps> = ({ pdfUrl, annotations }) => {
  const { currentPage, setTotalPages } = usePdfStore();
  const [pdf, setPdf] = useState<pdfjs.PDFDocumentProxy>();
  const [pageImage, setPageImage] = useState<string>("");
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });

  const pageAnnotations = annotations.filter((a) => a.pdf_page === currentPage);

  useEffect(() => {
    pdfjs.getDocument(pdfUrl).promise.then(setPdf);
  }, [pdfUrl]);

  const renderPage = useCallback(
    async (pageNumber: number) => {
      if (!pdf) return;

      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2 });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderTask = page.render({
        canvas,
        canvasContext: ctx,
        viewport,
      });

      await renderTask.promise;

      setPageImage(canvas.toDataURL("image/png"));
      setPageSize({ width: viewport.width, height: viewport.height });
    },
    [pdf]
  );

  useEffect(() => {
    if (pdf) {
      renderPage(currentPage);
      setTotalPages(pdf.numPages);
    }
  }, [pdf, currentPage, renderPage]);

  if (!pdf) return <Spinner />;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 min-h-0">
        {pageImage && (
          <ImageKanvas
            imageUrl={pageImage}
            width={pageSize.width}
            height={pageSize.height}
            annotations={pageAnnotations}
            pdf_page={currentPage}
          />
        )}
      </div>

      <KanvasToolbar isPDF />
    </div>
  );
};

export default PdfFile;
