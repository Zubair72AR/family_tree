"use client";

import { Handle, Position } from "@xyflow/react";
import { ProfileWithRelatives } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronDown, Heart } from "lucide-react";
import { NodeProfileCard } from "./NodeProfileCard";

interface Props {
  data: {
    profile: ProfileWithRelatives;
    spouseProfile: ProfileWithRelatives | null;
    childCount: number;
    onToggle: (id: string) => void;
    isCollapsed: boolean;
    width: number;
    focusId: string;
    highlight: boolean;
  };
}

export function FamilyNode({ data }: Props) {
  const {
    profile,
    spouseProfile,
    childCount,
    onToggle,
    isCollapsed,
    width,
    focusId,
    highlight,
  } = data;

  return (
    <div style={{ width: `${data.width}px` }}>
      {/* Parent handle */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          left: data.width === 150 ? "50%" : "25%",
          width: 12,
          height: 12,
          borderRadius: 6,
          background: profile.gender === "male" ? "#784efd" : "#ff277a",
        }}
      />

      {/* Node content */}
      <div
        onClick={() => onToggle(profile.id)}
        className={cn(
          "group hover:bg-primary hover:text-primary-foreground hover:border-primary border-background flex min-w-[150px] cursor-pointer items-center justify-between overflow-hidden rounded-4xl border-2 shadow-md/25",
          highlight
            ? "border-green-300 bg-green-600 text-green-100 shadow-[0_0_15px_3px_rgba(245,158,11,1)]"
            : focusId === profile.id
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-foreground",
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
            "group-hover:border-black/25 group-hover:bg-black/50",
            focusId === profile.id
              ? "rounded-4xl bg-black/40"
              : "rounded-4xl border",
          )}
        />
        {spouseProfile && <NodeProfileCard profile={spouseProfile} />}
      </div>

      {childCount > 0 && (
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
            {childCount}
            <ChevronDown
              className={cn("size-3.5", isCollapsed ? "" : "rotate-180")}
            />
          </div>
        </Handle>
      )}
    </div>
  );
}
