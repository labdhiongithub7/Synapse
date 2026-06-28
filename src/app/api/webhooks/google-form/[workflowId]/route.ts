import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
import { NodeType } from "@/generated/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  try {
    const { workflowId } = await params;
    
    // Find workflow
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      include: {
        nodes: true,
      }
    });

    if (!workflow) {
      return new NextResponse("Workflow not found", { status: 404 });
    }

    // Check if it has a Google Form trigger
    const triggerNode = workflow.nodes.find(
      (node) => node.type === NodeType.GOOGLE_FORM_TRIGGER
    );

    if (!triggerNode) {
      return new NextResponse("Workflow does not have a Google Form Trigger", { status: 400 });
    }

    // Get body data to pass as variables
    let variables = {};
    try {
      variables = await req.json();
    } catch {
      // Body might not be JSON or might be empty
    }

    // Trigger workflow execution via inngest
    await inngest.send({
      name: "execution.execute",
      data: {
        workflowId,
        variables,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[GOOGLE_FORM_WEBHOOK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
