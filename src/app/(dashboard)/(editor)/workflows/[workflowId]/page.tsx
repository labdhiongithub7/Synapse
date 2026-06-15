import { Suspense } from "react";
import { EditorHeader } from "@/features/editor/components/editor-header";
import { Editor } from "@/features/editor/components/editor";
import { LoadingView, ErrorView } from "@/components/entity-components";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  params: Promise<{ workflowId: string }>;
}

const Page = async ({ params }: Props) => {
  const { workflowId } = await params;

  return (
    <div className="flex flex-col h-screen">
      <ErrorBoundary fallback={<ErrorView message="Error loading workflow" />}>
        <Suspense fallback={<LoadingView message="Loading editor..." />}>
          <EditorHeader workflowId={workflowId} />
          <Editor workflowId={workflowId} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Page;
