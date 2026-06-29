import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const telegramMessageSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  message: z.string().min(1, "Message is required"),
});

export type TelegramMessageFormValues = z.infer<typeof telegramMessageSchema>;

interface TelegramMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TelegramMessageFormValues) => void;
  defaultValues?: Partial<TelegramMessageFormValues>;
}

export const TelegramMessageDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: TelegramMessageDialogProps) => {
  const form = useForm<TelegramMessageFormValues>({
    resolver: zodResolver(telegramMessageSchema),
    defaultValues: {
      chatId: defaultValues.chatId || "",
      message: defaultValues.message || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        chatId: defaultValues.chatId || "",
        message: defaultValues.message || "",
      });
    }
  }, [open, defaultValues, form]);

  const handleSubmit = (values: TelegramMessageFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Telegram Settings</DialogTitle>
          <DialogDescription>
            Configure the message to send via Telegram.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="chatId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chat ID</FormLabel>
                  <FormControl>
                    <Input placeholder="@channelname or numeric ID" {...field} />
                  </FormControl>
                  <FormDescription>
                    The target chat or channel.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Template</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Hello {{trigger.name}}!" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    The message content. You can use handlebars syntax to inject variables.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
