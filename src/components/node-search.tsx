import { useCallback, useState } from "react";

import {
  BuiltInEdge,
  useReactFlow,
  type Node,
  type PanelProps,
} from "@xyflow/react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { FamilyNodeData } from "@/lib/types";
import Image from "next/image";

type FamilyNode = Node<FamilyNodeData>;

export interface NodeSearchProps extends Omit<PanelProps, "children"> {
  // The function to search for nodes, should return an array of nodes that match the search string
  // By default, it will check for lowercase string inclusion.
  onSearch?: (searchString: string) => FamilyNode[];
  // The function to select a node, should set the node as selected and fit the view to the node
  // By default, it will set the node as selected and fit the view to the node.
  onSelectNode?: (node: FamilyNode) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NodeSearchInternal({
  className,
  onSearch,
  onSelectNode,
  open,
  onOpenChange,
  ...props
}: NodeSearchProps) {
  const [searchResults, setSearchResults] = useState<FamilyNode[]>([]);
  const [searchString, setSearchString] = useState<string>(""); // always empty on mount
  const { getNodes, fitView, setNodes } = useReactFlow<
    FamilyNode,
    BuiltInEdge
  >();

  const defaultOnSearch = useCallback(
    (searchString: string) => {
      if (!searchString) return []; // <-- only return results if user typed something
      const nodes = getNodes();
      return nodes.filter((node) => {
        const name = node.data.profile?.name_eng || "";
        return name.toLowerCase().includes(searchString.toLowerCase());
      });
    },
    [getNodes],
  );

  const onChange = useCallback(
    (value: string) => {
      setSearchString(value);
      if (value.length > 0) {
        onOpenChange?.(true);
        const results = (onSearch || defaultOnSearch)(value);
        setSearchResults(results);
      } else {
        setSearchResults([]); // <-- clear old results when input empty
      }
    },
    [onSearch, onOpenChange, defaultOnSearch],
  );

  const defaultOnSelectNode = useCallback(
    (node: FamilyNode) => {
      setNodes((nodes) =>
        nodes.map((n) => (n.id === node.id ? { ...n, selected: true } : n)),
      );
      fitView({ nodes: [node], duration: 500 });
    },
    [fitView, setNodes],
  );

  const onSelect = useCallback(
    (node: FamilyNode) => {
      (onSelectNode || defaultOnSelectNode)?.(node);
      setSearchString(""); // <-- clear input after selection
      setSearchResults([]); // <-- clear results
      onOpenChange?.(false);
    },
    [onSelectNode, defaultOnSelectNode, onOpenChange],
  );

  return (
    <>
      <CommandInput
        placeholder="Type name to search..."
        onValueChange={onChange}
        value={searchString}
        onFocus={() => onOpenChange?.(true)}
      />

      {open &&
        searchString.length > 0 && ( // <-- only show list if user typed
          <CommandList>
            {searchResults.length === 0 ? (
              <CommandEmpty>No results found. {searchString}</CommandEmpty>
            ) : (
              <CommandGroup heading="Members">
                {searchResults.map((node) => (
                  <CommandItem
                    key={node.data.profile.id}
                    onSelect={() => onSelect(node)}
                  >
                    {node.data.profile.gender && (
                      <Image
                        src={
                          node?.data.profile.profile_photo
                            ? node?.data.profile.profile_photo
                            : node?.data.profile.gender === "female"
                              ? "/female_profile.svg"
                              : "/male_profile.svg"
                        }
                        alt={node?.data.profile.name_eng || "Profile Photo"}
                        width={50}
                        height={50}
                        priority={false}
                        className="aspect-square rounded-lg border object-cover"
                      />
                    )}
                    <span>
                      <span className="text-foreground/65 text-base leading-tight font-semibold">
                        {node.data.profile.name_eng}
                      </span>
                      {node.data.profile.father_name &&
                        node.data.profile.father_name != "Unknown" && (
                          <span className="text-foreground/65 block text-sm leading-tight font-light">
                            {node.data.profile.gender === "male"
                              ? `S/o Mr. ${node.data.profile.father_name}`
                              : `D/o Mr. ${node.data.profile.father_name}`}
                          </span>
                        )}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
    </>
  );
}

export function NodeSearch({
  className,
  onSearch,
  onSelectNode,
  ...props
}: NodeSearchProps) {
  const [open, setOpen] = useState(false);
  return (
    <Command
      shouldFilter={false}
      className="border-2 shadow-md/25 md:min-w-[450px]"
    >
      <NodeSearchInternal
        className={className}
        onSearch={onSearch}
        onSelectNode={onSelectNode}
        open={open}
        onOpenChange={setOpen}
        {...props}
      />
    </Command>
  );
}

export interface NodeSearchDialogProps extends NodeSearchProps {
  title?: string;
}

export function NodeSearchDialog({
  className,
  onSearch,
  onSelectNode,
  open,
  onOpenChange,
  title = "Node Search",
  ...props
}: NodeSearchDialogProps) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <NodeSearchInternal
        className={className}
        onSearch={onSearch}
        onSelectNode={onSelectNode}
        open={open}
        onOpenChange={onOpenChange}
        {...props}
      />
    </CommandDialog>
  );
}
