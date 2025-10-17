"use client";

import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { Schema } from "effect";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { PasswordInput } from "@/components/ui/password-input";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { showSubmittedData } from "@/lib/show-submitted-data";

import type { User } from "../data/schema";

import { roles } from "../data/data";

const formSchema = Schema.Struct({
  confirmPassword: Schema.NonEmptyString.annotations({
    message: () => "Confirm Password is required.",
  }),
  email: Schema.NonEmptyString.annotations({
    message: () => "Email is required.",
  }).pipe(
    Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: () => "Invalid email format",
    }),
  ),
  firstName: Schema.NonEmptyString.annotations({
    message: () => "First Name is required.",
  }),
  isEdit: Schema.Boolean,
  lastName: Schema.NonEmptyString.annotations({
    message: () => "Last Name is required.",
  }),
  password: Schema.NonEmptyString.annotations({
    message: () => "Password is required.",
  }),
  phoneNumber: Schema.NonEmptyString.annotations({
    message: () => "Phone number is required.",
  }),
  role: Schema.NonEmptyString.annotations({
    message: () => "Role is required.",
  }),
  username: Schema.NonEmptyString.annotations({
    message: () => "Username is required.",
  }),
});

type UserActionDialogProps = {
  currentRow?: User;
  direction: "ltr" | "rtl";
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

type UserForm = Schema.Schema.Type<typeof formSchema>;

export function UsersActionDialog({
  currentRow,
  direction,
  onOpenChange,
  open,
}: UserActionDialogProps) {
  const isEdit = !!currentRow;
  const form = useForm<UserForm>({
    defaultValues: isEdit
      ? {
          ...currentRow,
          confirmPassword: "",
          isEdit,
          password: "",
        }
      : {
          confirmPassword: "",
          email: "",
          firstName: "",
          isEdit,
          lastName: "",
          password: "",
          phoneNumber: "",
          role: "",
          username: "",
        },
    resolver: effectTsResolver(formSchema),
  });

  const onSubmit = (values: UserForm) => {
    form.reset();
    showSubmittedData(values);
    onOpenChange(false);
  };

  const isPasswordTouched = !!form.formState.dirtyFields.password;

  return (
    <Dialog
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
      open={open}
    >
      <DialogContent className="sm:max-w-lg" direction={direction}>
        <DialogHeader className="text-start" direction={direction}>
          <DialogTitle>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the user here. " : "Create new user here. "}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              className="space-y-4 px-0.5"
              id="user-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        className="col-span-4"
                        placeholder="John"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        className="col-span-4"
                        placeholder="Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="col-span-4"
                        placeholder="john_doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Email</FormLabel>
                    <FormControl>
                      <Input
                        className="col-span-4"
                        placeholder="john.doe@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="col-span-4"
                        placeholder="+123456789"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Role</FormLabel>
                    <SelectDropdown
                      className="col-span-4"
                      defaultValue={field.value}
                      direction={direction}
                      items={roles.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                      onValueChange={field.onChange}
                      placeholder="Select a role"
                    />
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        className="col-span-4"
                        placeholder="e.g., S3cur3P@ssw0rd"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        className="col-span-4"
                        disabled={!isPasswordTouched}
                        placeholder="e.g., S3cur3P@ssw0rd"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button form="user-form" type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
