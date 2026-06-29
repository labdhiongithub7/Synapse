import { NodeExecutor } from "@/features/executions/types";
import { waitChannel } from "@/inngest/channels/wait";

export const waitExecutor: NodeExecutor = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(waitChannel().status({
    nodeId,
    status: "loading",
  }));

  const durationStr = (data.duration as string) || "5";
  const unit = (data.unit as string) || "seconds";
  
  let durationInSeconds = parseInt(durationStr, 10);
  if (isNaN(durationInSeconds)) durationInSeconds = 5;

  if (unit === "minutes") {
    durationInSeconds *= 60;
  } else if (unit === "hours") {
    durationInSeconds *= 3600;
  }

  // Cap at 1 hour for safety in this project
  if (durationInSeconds > 3600) {
    durationInSeconds = 3600;
  }
  if (durationInSeconds < 1) {
    durationInSeconds = 1;
  }

  const durationString = `${durationInSeconds}s`;

  await step.sleep(`wait-${nodeId}`, durationString);

  await publish(waitChannel().status({
    nodeId,
    status: "success",
  }));

  return context;
};
