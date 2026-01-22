"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  ReactFlowInstance,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ProfileWithRelatives } from "@/lib/types";
import { FamilyNode } from "./FamilyNode";
import { NodeSearch } from "../node-search";
import { Button } from "../ui/button";
import { GrUserFemale, GrUser } from "react-icons/gr";
import { cn } from "@/lib/utils";

// Tree node structure
type TreeNode = {
  profile: ProfileWithRelatives;
  children: TreeNode[];
  x?: number;
  y?: number;
  collapsed?: boolean;
};

interface TreeClientProps {
  profiles: ProfileWithRelatives[];
  focusId: string;
}

export default function TreeClient({ profiles, focusId }: TreeClientProps) {
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  // Focus ID
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  // Lineage Switch mode
  const [lineageMode, setLineageMode] = useState<"father" | "mother">("father");

  // Node Height
  const LEVEL_HEIGHT = 400;
  const H_GAP = 15;

  // Get Node Width According to Child
  const getNodeWidth = (profile: ProfileWithRelatives) => {
    return profile.children_count > 0 || profile.spouse_id ? 315 : 150;
  };

  // --- 1️⃣ Find tree head ---
  const findTreeHead = (focusId: string): ProfileWithRelatives | null => {
    let current = profiles.find((p) => p.id === focusId);
    if (!current) return null;

    const parentKey = lineageMode === "father" ? "father_id" : "mother_id";

    while (current[parentKey]) {
      const parent = profiles.find((p) => p.id === current![parentKey]);
      if (!parent) break;
      current = parent;
    }

    return current;
  };

  //   Sort Children by DOB
  const sortChildren = (children: ProfileWithRelatives[]) => {
    return [...children].sort((a, b) => {
      if (!a.date_of_birth || !b.date_of_birth) return 0;
      return (
        new Date(a.date_of_birth).getTime() -
        new Date(b.date_of_birth).getTime()
      );
    });
  };

  // --- Precompute children map ---
  // const childrenMap = useMemo(() => {
  //   const map = new Map<string, ProfileWithRelatives[]>();
  //   for (const p of profiles) {
  //     const key = lineageMode === "father" ? p.father_id : p.mother_id;
  //     if (!key) continue;
  //     if (!map.has(key)) map.set(key, []);
  //     map.get(key)!.push(p);
  //   }
  //   return map;
  // }, [profiles, lineageMode]);
  const childrenMap = useMemo(() => {
    const map = new Map<string, ProfileWithRelatives[]>();
    for (const p of profiles) {
      // Add child to father map
      if (p.father_id) {
        if (!map.has(p.father_id)) map.set(p.father_id, []);
        map.get(p.father_id)!.push(p);
      }
      // Add child to mother map
      if (p.mother_id) {
        if (!map.has(p.mother_id)) map.set(p.mother_id, []);
        map.get(p.mother_id)!.push(p);
      }
    }
    return map;
  }, [profiles]);

  // --- 2️⃣ Build tree recursively ---
  // const buildTree = (nodeProfile: ProfileWithRelatives): TreeNode => {
  //   const childrenProfiles = sortChildren(
  //     childrenMap.get(nodeProfile.id) || [],
  //   );
  //   const childrenNodes = childrenProfiles.map(buildTree);
  //   return { profile: nodeProfile, children: childrenNodes };
  // };
  const buildTree = (
    nodeProfile: ProfileWithRelatives,
    lineageMode: "father" | "mother",
    depth = 0,
  ): TreeNode => {
    const childrenProfiles = sortChildren(
      childrenMap.get(nodeProfile.id) || [],
    );
    const childrenNodes: TreeNode[] = [];

    for (const child of childrenProfiles) {
      let recurse = true;

      // Father lineage rules
      if (lineageMode === "father") {
        if (child.gender === "female" && depth >= 1) recurse = false;
      }

      // Mother lineage rules
      if (lineageMode === "mother") {
        if (child.gender === "male" && depth >= 1) recurse = false;
      }

      // Recurse children if allowed
      let grandChildrenNodes: TreeNode[] = [];
      if (recurse) {
        grandChildrenNodes = (childrenMap.get(child.id) || []).map((gc) =>
          buildTree(gc, lineageMode, depth + 1),
        );
      } else {
        // Only include direct children (one level) and their children (two levels total)
        const directChildren = childrenMap.get(child.id) || [];
        grandChildrenNodes = directChildren.map((gc) => ({
          profile: gc,
          children: (childrenMap.get(gc.id) || []).map((g) => ({
            profile: g,
            children: [],
          })),
        }));
      }

      childrenNodes.push({ profile: child, children: grandChildrenNodes });
    }

    // Spouse children (always direct children, same as before)
    if (nodeProfile.spouse_id) {
      const spouseProfile = profiles.find(
        (p) => p.id === nodeProfile.spouse_id,
      );
      if (spouseProfile) {
        const spouseChildren = childrenMap.get(spouseProfile.id) || [];
        for (const child of spouseChildren) {
          if (!childrenNodes.some((n) => n.profile.id === child.id)) {
            childrenNodes.push({ profile: child, children: [] });
          }
        }
      }
    }

    return { profile: nodeProfile, children: childrenNodes };
  };

  // --- 3️⃣ Layout tree recursively ---
  const layoutTree = (node: TreeNode, xOffset = 0, depth = 0): number => {
    const nodeWidth = getNodeWidth(node.profile);
    node.y = depth * LEVEL_HEIGHT;

    if (node.children.length === 0 || collapsedNodes.has(node.profile.id)) {
      node.x = xOffset;
      return xOffset + nodeWidth + H_GAP;
    }

    let totalWidth = 0;
    const childCenters: number[] = [];

    for (const child of node.children) {
      const nextX = layoutTree(child, xOffset + totalWidth, depth + 1);
      const childWidth = getNodeWidth(child.profile);
      const centerX = (child.x ?? 0) + childWidth / 2;
      childCenters.push(centerX);
      totalWidth += nextX - (xOffset + totalWidth);
    }

    // Parent should be centered over children, but ensure it doesn't go left of xOffset
    const childrenCenter =
      childCenters.reduce((a, b) => a + b, 0) / childCenters.length;
    node.x = Math.max(xOffset, childrenCenter - nodeWidth / 2);

    return xOffset + Math.max(totalWidth, nodeWidth + H_GAP); // return full width of subtree
  };

  // --- 4️⃣ Convert tree to nodes/edges ---
  const traverseTree = (node: TreeNode, nodesArr: Node[], edgesArr: Edge[]) => {
    // Find Spouse
    const spouseProfile = node.profile.spouse_id
      ? (profiles.find((p) => p.id === node.profile.spouse_id) ?? null)
      : null;
    // Node with rounded corners and shadow
    nodesArr.push({
      id: node.profile.id,
      type: "family",
      position: { x: node.x!, y: node.y! },
      data: {
        profile: node.profile,
        spouseProfile,
        childCount: node.profile.children_count,
        onToggle: handleNodeClick,
        isCollapsed: collapsedNodes.has(node.profile.id),
        width: getNodeWidth(node.profile),
        focusId: focusId,
      },
    });

    for (const child of node.children) {
      if (!collapsedNodes.has(node.profile.id)) {
        const strokeColor =
          child.profile.gender === "male" ? "#7c3aed" : "#ec4899"; // purple / pink
        edgesArr.push({
          id: `${node.profile.id}-${child.profile.id}`,
          source: node.profile.id,
          target: child.profile.id,
          type: "bezier",
          style: {
            stroke: strokeColor,
            strokeDasharray: 5,
            strokeWidth: 2,
          },
          animated: true,
        });
        traverseTree(child, nodesArr, edgesArr);
      }
    }
  };

  // --- 5️⃣ Collapse / expand ---
  const handleNodeClick = useCallback(
    (nodeId: string) => {
      const newSet = new Set(collapsedNodes);
      if (newSet.has(nodeId)) newSet.delete(nodeId);
      else newSet.add(nodeId);
      setCollapsedNodes(newSet);
    },
    [collapsedNodes],
  );

  // --- 6️⃣ Build nodes / edges whenever focusId or collapse changes ---
  useEffect(() => {
    const headProfile = findTreeHead(focusId);
    if (!headProfile) return;

    const treeHead = buildTree(headProfile, lineageMode);
    layoutTree(treeHead, 0, 0);

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    traverseTree(treeHead, newNodes, newEdges);

    setNodes(newNodes);
    setEdges(newEdges);

    if (rfInstance) {
      // ✅ If user just collapsed/expanded node → show full tree
      // ✅ If first load → focus node
      if (collapsedNodes.size > 0) {
        rfInstance.fitView({ padding: 0.2, includeHiddenNodes: true });
      } else {
        const focusNode = newNodes.find((n) => n.id === focusId);
        if (focusNode) {
          const focusProfile = profiles.find((p) => p.id === focusId);
          const focusWidth = focusProfile ? getNodeWidth(focusProfile) : 150;

          rfInstance.setCenter(
            focusNode.position.x + focusWidth / 2,
            focusNode.position.y + 150,
            { zoom: 1, duration: 2000 },
          );
        }
      }
    }
  }, [focusId, collapsedNodes, rfInstance, lineageMode]);

  const nodeTypes = {
    family: FamilyNode,
  };

  return (
    <div className="bg-foreground/10 relative mx-auto h-full w-full">
      <div className="absolute top-16 right-3.5 z-50 text-xs shadow-md/25">
        <Button
          onClick={() => setLineageMode("father")}
          variant="outline"
          className={cn(
            "h-8 gap-1 has-[>svg]:px-2",
            lineageMode === "father"
              ? "bg-[#7c3aed] text-white dark:bg-[#7c3aed]"
              : "",
          )}
        >
          <GrUser /> Lineage
        </Button>

        <Button
          onClick={() => setLineageMode("mother")}
          variant="outline"
          className={cn(
            "h-8 gap-1 has-[>svg]:px-2",
            lineageMode === "mother"
              ? "bg-[#ec4899] text-white dark:bg-[#ec4899]"
              : "",
          )}
        >
          <GrUserFemale /> Lineage
        </Button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        onInit={setRfInstance}
        minZoom={0.1}
        maxZoom={5} // increase this (default is 2)
        zoomOnScroll
        zoomOnPinch
      >
        <Controls showInteractive={false} position="top-left" />
        <Panel position="top-right">
          <NodeSearch
            onSelectNode={(node) => {
              // Focus the selected node in React Flow
              const profile = node.data.profile;
              const nodeWidth = profile ? getNodeWidth(profile) : 150;

              rfInstance?.setCenter(
                node.position.x + nodeWidth / 2,
                node.position.y + 150,
                { zoom: 1, duration: 2000 },
              );
              // 2️⃣ Update node data to include `highlight`
              setNodes((prev) =>
                prev.map(
                  (n) =>
                    n.id === node.id
                      ? { ...n, data: { ...n.data, highlight: true } }
                      : { ...n, data: { ...n.data, highlight: false } }, // remove highlight from others
                ),
              );
            }}
          />
        </Panel>
      </ReactFlow>
    </div>
  );
}
