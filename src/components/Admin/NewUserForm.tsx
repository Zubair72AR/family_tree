"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

import { Combobox } from "@/components/ui/combobox"; // Your existing combobox
import { AdminLineage } from "@/lib/types";
import { createUserByAdmin } from "@/actions/create-admin-user";
import { ComboBoxLineage } from "../ui/comboboxlineage";

const newUserSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Please enter a valid email"),
    role: z.enum(["editor", "viewer"]),
    share_full_tree: z.boolean(),
    lineage_id: z.string().optional(),
  })
  .refine(
    (data) =>
      data.share_full_tree || (!!data.lineage_id && data.lineage_id !== ""),
    {
      message: "Please select a lineage or enable 'Share full tree'",
      path: ["lineage_id"], // show error on lineage_id field
    },
  );

type NewUserValues = z.infer<typeof newUserSchema>;

type Props = {
  lineages: AdminLineage[];
  onUserCreated: () => void;
};

export function NewUserForm({ lineages, onUserCreated }: Props) {
  const [loading, setLoading] = useState(false);

  const form = useForm<NewUserValues>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "viewer",
      share_full_tree: true,
      lineage_id: "",
    },
  });

  async function onSubmit(data: NewUserValues) {
    setLoading(true);
    try {
      const payload = { ...data };
      if (data.share_full_tree) delete payload.lineage_id;

      const result = await createUserByAdmin(payload); // new version without password

      if (result.error) toast.error(result.error);
      else {
        toast.success(result.message || "User invited successfully!");
        form.reset();
        if (onUserCreated) onUserCreated();
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Full Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role as Radio */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-4"
                >
                  <FormItem className="flex items-center">
                    <FormControl>
                      <RadioGroupItem value="viewer" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Viewer (Read Only)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center">
                    <FormControl>
                      <RadioGroupItem value="editor" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Editor (Can Edit Profiles)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Share full tree checkbox */}
        <FormField
          control={form.control}
          name="share_full_tree"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>
                Full Tree Access
                <span className="font-light">(All members visible)</span>
              </FormLabel>
            </FormItem>
          )}
        />

        {/* Lineage dropdown only if share_full_tree is false */}
        {!form.watch("share_full_tree") && (
          <FormField
            control={form.control}
            name="lineage_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Select a lineage
                  <span className="font-light">
                    (Selected Members to Share)
                  </span>
                </FormLabel>
                <FormControl>
                  <ComboBoxLineage
                    label="Lineage"
                    value={field.value || null}
                    onChange={field.onChange}
                    options={lineages}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create User"}
        </Button>
      </form>
    </Form>
  );
}
