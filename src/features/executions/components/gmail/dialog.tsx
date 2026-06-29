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

const gmailSchema = z.object({
  senderEmail: z.string().email("Valid sender email is required"),
  to: z.string().min(1, "Recipient is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
});

export type GmailFormValues = z.infer<typeof gmailSchema>;

interface GmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GmailFormValues) => void;
  defaultValues?: Partial<GmailFormValues>;
}

export const GmailDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: GmailDialogProps) => {
  const form = useForm<GmailFormValues>({
    resolver: zodResolver(gmailSchema),
    defaultValues: {
      senderEmail: defaultValues.senderEmail || "",
      to: defaultValues.to || "",
      subject: defaultValues.subject || "",
      body: defaultValues.body || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        senderEmail: defaultValues.senderEmail || "",
        to: defaultValues.to || "",
        subject: defaultValues.subject || "",
        body: defaultValues.body || "",
      });
    }
  }, [open, defaultValues, form]);

  const handleSubmit = (values: GmailFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gmail Settings</DialogTitle>
          <DialogDescription>
            Configure the email to send via Gmail.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="senderEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sender Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <Input placeholder="recipient@example.com or {{trigger.email}}" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Hello {{trigger.name}}" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body Template</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Email content..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
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
