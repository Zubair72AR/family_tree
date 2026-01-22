"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { getUsersCreatedByAdmin } from "@/actions/get-admin-users";
import { deleteUserByAdmin } from "@/actions/delete-user-by-admin";
import { NewUserForm } from "./NewUserForm";
import { AdminLineage } from "@/lib/types";
import { Plus } from "lucide-react";
import DateDisplay from "../AllProfile/DateDisplay";
import { cn } from "@/lib/utils";

type User = {
  id: string;
  name: string;
  email: string;
  role: "editor" | "viewer";
  lineage_id: string | null;
  // createdAt: Date;
  emailVerified: boolean;
};

type Props = {
  lineages: AdminLineage[];
};

export function AdminUsersSection({ lineages }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res: any = await getUsersCreatedByAdmin();
      if (res?.error) toast.error(res.error);
      else setUsers(res);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleDelete(userId: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await deleteUserByAdmin(userId);
    if (res?.error) toast.error(res.error);
    else {
      toast.success("User deleted");
      fetchUsers();
    }
  }

  function handleUserCreated() {
    fetchUsers();
    setOpen(false);
  }

  return (
    <div className="pad-x mx-auto w-full max-w-6xl py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row">
        <div>
          <h1 className="font-bodoni text-3xl">Create Shared User</h1>
          <p className="text-foreground/65 text-sm">
            Create a user to securely share access to your family tree.
          </p>
        </div>

        {users.length > 0 && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="primary">
                <Plus />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Shared User</DialogTitle>
                <DialogDescription>
                  Grant access to your family tree by creating a new user.
                </DialogDescription>
              </DialogHeader>

              <NewUserForm
                lineages={lineages}
                onUserCreated={handleUserCreated}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="mb-6">
        <p className="text-foreground/65 text-sm">
          The user will receive a verification email to set their password and
          sign in. Access is granted based on the assigned role. View-only users
          can see the shared family tree, while editors can add, edit, or delete
          profiles. Removing a user immediately revokes their access.
        </p>
        <p className="text-destructive mt-2 text-sm">
          *This access includes the full hierarchy of the lineage: spouses,
          children, and children of children, even if some of them belong to
          other lineages.
        </p>
      </div>
      {/* Users Grid */}
      {loading ? (
        <div className="bg-accent col-span-full grid h-48 place-items-center rounded-2xl border border-dashed">
          <p className="text-foreground/65 text-sm">Loading user....</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {users.length > 0 ? (
            users.map((user, idx) => (
              <Card key={idx} className="p-4">
                <div className="text-center">
                  {/* Name */}
                  <p className="font-bodoni text-lg">{user.name}</p>

                  <hr className="my-1" />
                  {/* Email */}
                  <p
                    className={cn(
                      "text-foreground/65 text-sm",
                      user.emailVerified && "verifiedIcon [--icon-size:12px]",
                    )}
                  >
                    {user.email}
                  </p>

                  <hr className="my-1" />

                  {/* Role */}
                  <p className="text-foreground/65 text-sm">
                    Role:{" "}
                    <span
                      className={cn(
                        "px-2 py-0.5 text-xs text-white capitalize",
                        user.role === "viewer" ? "bg-blue-500" : "bg-green-500",
                      )}
                    >
                      {user.role}
                    </span>
                  </p>

                  <hr className="my-1" />
                  {/* Lineage or Full Tree */}

                  <p className="text-foreground/65 mb-4 text-sm">
                    Access Scope:{" "}
                    {user.lineage_id ? (
                      <span>
                        <span className="line-clamp-1 block font-semibold">
                          {
                            lineages.find(
                              (line) => line.lineage_id === user.lineage_id,
                            )?.lineage_name
                          }{" "}
                          Lineage{" "}
                          <span className="text-destructive font-black">*</span>
                        </span>
                        <span className="text-destructive block text-xs">
                          includes connected relatives: spouses & children*
                        </span>
                      </span>
                    ) : (
                      <span>
                        <span className="line-clamp-1 block font-semibold">
                          All Family Lineages{" "}
                          <span className="font-black text-green-600">*</span>
                        </span>
                        <span className="block text-xs text-green-600">
                          Full access to all Profiles across all Lineages.
                        </span>
                      </span>
                    )}
                  </p>
                  {/* Delete Button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            // No users exist
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <div className="hover:bg-accent col-span-full cursor-pointer space-y-6 rounded-2xl border border-dashed px-6 py-20 text-center">
                  <div className="space-y-1">
                    <h1 className="font-bodoni text-[26px]">
                      No Users Added Yet
                    </h1>
                    <p className="text-foreground/65 mb-4 text-sm">
                      Grant access to your family tree to relatives or
                      collaborators.
                    </p>
                  </div>
                  <Button variant="primary">Create User</Button>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Shared User</DialogTitle>
                  <DialogDescription>
                    Grant access to your family tree by creating a new user.
                  </DialogDescription>
                </DialogHeader>

                <NewUserForm
                  lineages={lineages}
                  onUserCreated={handleUserCreated}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
}
