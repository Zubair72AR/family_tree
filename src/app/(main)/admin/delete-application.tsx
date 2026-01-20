"use client";

import { LoadingButton } from "@/components/loading-button";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteApplication } from "./actions";
import { Input } from "@/components/ui/input";

export function DeleteApplication() {
  const [isPending, startTransition] = useTransition();
  const [confirmText, setConfirmText] = useState("");

  const isAllowed = confirmText === "DELETE";

  function handleDeleteApplication() {
    if (!isAllowed) {
      toast.error('Type "DELETE" to confirm');
      return;
    }

    startTransition(async () => {
      try {
        await deleteApplication();
        toast.success("Application deleted successfully");

        // Full reload to reset the site
        window.location.href = "/";
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <div className="max-w-md">
      <div className="border-destructive/20 bg-destructive/5 border p-4">
        <div className="space-y-3">
          <div>
            <h2 className="text-destructive font-semibold">
              Delete Application
            </h2>
            <p className="text-foreground/65 text-sm">
              This action will delete the entire application. This cannot be
              undone.
              <br />
              Type <b>DELETE</b> to confirm.
            </p>
          </div>
          <Input
            placeholder='Type "DELETE"'
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
          <LoadingButton
            loading={isPending}
            onClick={handleDeleteApplication}
            variant="destructive"
            className="w-full"
            disabled={!isAllowed}
          >
            Delete Application
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
