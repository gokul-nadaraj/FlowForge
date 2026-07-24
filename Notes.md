# Last Changes

## Flow Execution Order Fix

The flow execution engine was refactored so nodes run according to the workflow graph instead of the order they appear in the `nodes` array.

Why this changed:

- The previous `runFlow()` implementation depended on array order, so moving, saving, reloading, or otherwise reordering nodes could produce incorrect results.
- Workflow execution should follow connections between nodes: source nodes such as Manual nodes run first, then downstream Transform, Log, and Webhook nodes run after their parent outputs are available.
- The webhook node should receive the processed value from its connected parent, not a fallback value from whichever node happened to execute most recently.

What changed:

- Built graph maps from `edges`, including outgoing edges, incoming edges, and in-degree counts.
- Added topological execution ordering so each node runs only after its connected parent node or nodes have run.
- Stored node outputs by node ID and used the connected parent output as the child input.
- Removed the `latestOutput` workaround because graph-based execution now provides the correct input directly.

What stayed the same:

- No UI, component, backend API, save/reload, or webhook feature behavior was intentionally changed.
- `runFlow()` keeps the same function signature.
- Webhook status updates and Log node result updates still use the existing `setNodes` behavior.
