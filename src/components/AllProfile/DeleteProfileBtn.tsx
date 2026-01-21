"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteProfile } from "@/actions/deleteProfile";

type DeleteProfileButtonProps = {
  profileId: string;
  profileName: string;
};

export default function DeleteProfileBtn({
  profileId,
  profileName,
}: DeleteProfileButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    toast.warning("Confirm Delete", {
      description: `"${profileName}" will be permanently removed.`,
      action: {
        label: "Yes, Delete",
        onClick: async () => {
          try {
            await deleteProfile(profileId); // <-- await added
            toast.info("Deleted Successfully", {
              description: `"${profileName}" has been removed.`,
            });
            router.refresh(); // refresh the current page
          } catch (err: any) {
            toast.error("Delete Failed", {
              description: err?.message || "Something went wrong",
            });
          }
        },
      },
      duration: 10000,
    });
  }

  return (
    <Button
      className="bg-accent hover:bg-destructive dark:hover:bg-destructive h-8 px-1 py-1 hover:text-white"
      onClick={handleDelete}
      variant="ghost"
    >
      <Trash2 />
      Delete
    </Button>
  );
}
