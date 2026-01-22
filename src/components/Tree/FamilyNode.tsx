"use client";

import { Handle, Position } from "@xyflow/react";
import { TreeProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronDown, Heart } from "lucide-react";
import { NodeProfileCard } from "./NodeProfileCard";

interface Props {
  data: {
    profile: TreeProfile;
    spouseProfile: TreeProfile | null;
    onToggle: (id: string) => void;
    isCollapsed: boolean;
    totalWidth: number;
    focusId: string;
    highlight: boolean;
  };
}

export function FamilyNode({ data }: Props) {
  const {
    profile,
    spouseProfile,
    onToggle,
    isCollapsed,
    totalWidth,
    focusId,
    highlight,
  } = data;

  return (
    <div style={{ width: `${totalWidth}px` }}>
      {/* Parent handle */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          left: totalWidth === 150 ? "50%" : "25%",
          top: 2,
          width: 14,
          height: 14,
          borderRadius: 7,
          background: profile.gender === "male" ? "#784efd" : "#ff277a",
        }}
      />

      {/* Node content */}
      <div
        onClick={() => onToggle(profile.id)}
        className={cn(
          "bg-background border-foreground/15 text-foreground group grid min-w-[150px] cursor-pointer overflow-hidden rounded-[27px] border border-y-6 shadow-md/25",
          highlight
            ? "border-blue-900 bg-blue-800 text-white"
            : focusId === profile.id
              ? "border-green-900 bg-green-700 text-white"
              : profile.gender === "male"
                ? "border-b-purple-500"
                : "border-b-rose-500",
          profile.spouse_id ? "grid-cols-2" : "",
        )}
      >
        {spouseProfile && (
          <div className="absolute top-15 left-1/2 z-10 -translate-x-1/2 space-y-16">
            <div className="flex items-center justify-center">
              <span className="size-1.5 rounded-full bg-red-400"></span>
              <hr className="w-1.5 border" />
              <Heart className="size-5 fill-red-300 stroke-red-600 stroke-1" />
              <hr className="w-1.5 border" />
              <span className="size-1.5 rounded-full bg-red-400"></span>
            </div>
          </div>
        )}
        <NodeProfileCard
          profile={profile}
          className={cn(
            "group-hover:bg-primary rounded-4xl group-hover:text-white",
            profile.spouse_id && "border",
          )}
        />
        {spouseProfile && <NodeProfileCard profile={spouseProfile} />}
      </div>

      {profile.children_count > 0 && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            width: 40,
            height: 20,
            borderRadius: 10,
            // bottom: -15,
            overflow: "hidden",
          }}
          className="cursor-pointer"
        >
          <div className="flex h-full w-full items-center justify-center gap-0.5 py-1 ps-1.5 text-xs text-white/75">
            {profile.children_count}
            <ChevronDown
              className={cn("size-3.5", isCollapsed ? "" : "rotate-180")}
            />
          </div>
        </Handle>
      )}
    </div>
  );
}
