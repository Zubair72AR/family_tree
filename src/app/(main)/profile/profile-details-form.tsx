"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";

import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/user-avatar";

import { User } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { uploadUserPhoto } from "@/actions/upload";
import { toast } from "sonner";

/* ---------------- Schema ---------------- */

const updateProfileSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  image: z.string().optional().nullable(),
});

type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

interface ProfileDetailsFormProps {
  user: User;
}

/* ---------------- Component ---------------- */

export function ProfileDetailsForm({ user }: ProfileDetailsFormProps) {
  const router = useRouter();

  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const form = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name ?? "",
      image: user.image ?? null,
    },
  });

  /* ---------------- Submit ---------------- */

  async function onSubmit({ name }: UpdateProfileValues) {
    setStatus(null);
    setError(null);

    try {
      let uploadedUrl = user.image ?? null;

      // ✅ upload ONLY on submit
      if (photoFile) {
        uploadedUrl = await uploadUserPhoto(photoFile);
      }

      const { error } = await authClient.updateUser({
        name,
        image: uploadedUrl,
      });

      if (error) {
        setError(error.message || "Failed to update profile");
        return;
      }

      setStatus("Profile updated");
      setPhotoFile(null);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    }
  }

  /* ---------------- Image Change ---------------- */

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Check file size (500 KB max)
    const maxSize = 500 * 1024; // 500 KB in bytes
    if (file && file.size > maxSize) {
      toast.warning("File Too Large", {
        description: "Please select an image under 500 KB",
      });
      return;
    }
    if (!file) return;

    setPhotoFile(file);

    // local preview only
    const previewUrl = URL.createObjectURL(file);
    form.setValue("image", previewUrl, { shouldDirty: true });
  }

  const imagePreview = form.watch("image");
  const loading = form.formState.isSubmitting;

  /* ---------------- UI ---------------- */

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bodoni text-xl">Profile Details</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Full name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image */}
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Profile image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview */}
            {imagePreview && (
              <div className="relative size-16">
                <UserAvatar
                  name={user.name}
                  image={imagePreview}
                  className="size-16 border"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute -top-2 -right-2 size-6 rounded-full"
                  onClick={() => {
                    setPhotoFile(null);
                    form.setValue("image", null, { shouldDirty: true });
                  }}
                  aria-label="Remove image"
                >
                  <XIcon className="size-4" />
                </Button>
              </div>
            )}

            {/* Messages */}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {status && <p className="text-sm text-green-600">{status}</p>}

            {/* Submit */}
            <LoadingButton type="submit" loading={loading}>
              Save changes
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
