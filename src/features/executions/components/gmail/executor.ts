import { NodeExecutor } from "@/features/executions/types";
import { gmailChannel } from "@/inngest/channels/gmail";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import { CredentialType } from "@/generated/prisma";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import nodemailer from "nodemailer";

export const gmailExecutor: NodeExecutor = async ({
  data,
  nodeId,
  context,
  step,
  publish,
  userId,
}) => {
  await publish(gmailChannel().status({
    nodeId,
    status: "loading",
  }));

  try {
    const credential = await step.run("get-gmail-credential", async () => {
      const cred = await prisma.credential.findFirst({
        where: {
          userId,
          type: CredentialType.GMAIL,
        },
      });

      if (!cred) {
        throw new NonRetriableError("Gmail credential not found");
      }

      return {
        ...cred,
        value: decrypt(cred.value),
      };
    });

    const senderEmail = data.senderEmail as string;
    const rawTo = data.to as string;
    const rawSubject = data.subject as string;
    const rawBody = data.body as string;

    if (!senderEmail || !rawTo || !rawSubject || !rawBody) {
      throw new NonRetriableError("Missing required Gmail settings (sender, to, subject, or body)");
    }

    const toTemplate = Handlebars.compile(rawTo);
    const subjectTemplate = Handlebars.compile(rawSubject);
    const bodyTemplate = Handlebars.compile(rawBody);

    const resolvedTo = toTemplate(context);
    const resolvedSubject = subjectTemplate(context);
    const resolvedBody = bodyTemplate(context);

    await step.run("send-gmail", async () => {
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: senderEmail,
            pass: credential.value,
          },
        });

        await transporter.sendMail({
          from: senderEmail,
          to: resolvedTo,
          subject: resolvedSubject,
          text: resolvedBody,
        });
      } catch (error) {
        throw new Error(`Failed to send email: ${(error as Error).message}`);
      }
    });

    await publish(gmailChannel().status({
      nodeId,
      status: "success",
    }));

    return context;
  } catch (error) {
    await publish(gmailChannel().status({
      nodeId,
      status: "error",
    }));
    throw error;
  }
};
