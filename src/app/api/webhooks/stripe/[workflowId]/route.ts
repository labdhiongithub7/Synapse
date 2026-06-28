import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
import { NodeType } from "@/generated/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

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

    // Check if it has a Stripe trigger
    const triggerNode = workflow.nodes.find(
      (node) => node.type === NodeType.STRIPE_TRIGGER
    );

    if (!triggerNode) {
      return new NextResponse("Workflow does not have a Stripe Trigger", { status: 400 });
    }

    // Stripe sends raw JSON, no signature verification for now unless we store stripe secrets
    let variables = {};
    try {
      variables = await req.json();
    } catch {
      // Body might not be JSON
    }

    // Trigger workflow execution via inngest
    await inngest.send({
      name: "execution.execute",
      data: {
        workflowId,
        variables,
      },
    });

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error("[STRIPE_WEBHOOK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
