import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { Schema } from "effect";
import { MailPlus, Send } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { Textarea } from "@/components/ui/textarea";
import { showSubmittedData } from "@/lib/show-submitted-data";

import { roles } from "../data/data";

const formSchema = Schema.Struct({
  desc: Schema.optionalWith(Schema.String, { exact: true }),
  email: Schema.NonEmptyString.annotations({
    message: () => "Email is required.",
  }).pipe(
    Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: () => "Invalid email format",
    }),
  ),
  role: Schema.NonEmptyString.annotations({
    message: () => "Role is required.",
  }),
});
type UserInviteDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

type UserInviteForm = typeof formSchema.Type;

export function UsersInviteDialog({
  onOpenChange,
  open,
}: UserInviteDialogProps) {
  const form = useForm<UserInviteForm>({
    defaultValues: { desc: "", email: "", role: "" },
    resolver: effectTsResolver(formSchema),
  });

  const onSubmit = (values: UserInviteForm) => {
    form.reset();
    showSubmittedData(values);
    onOpenChange(false);
  };

  return (
    <Dialog
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
      open={open}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <DialogTitle className="flex items-center gap-2">
            <MailPlus /> Invite User
          </DialogTitle>
          <DialogDescription>
            Invite new user to join your team by sending them an email
            invitation. Assign a role to define their access level.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            id="user-invite-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="eg: john.doe@gmail.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    items={roles.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                    onValueChange={field.onChange}
                    placeholder="Select a role"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Add a personal note to your invitation (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-y-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button form="user-invite-form" type="submit">
            Invite <Send />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
