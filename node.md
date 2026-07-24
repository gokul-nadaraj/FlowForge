# FlowForge Node Notes

## Frontend code organization

The frontend code was separated into smaller files to make the project easier to
read, maintain, and extend without changing the app behavior. `App.tsx` now works
as the main orchestrator, while UI nodes, state logic, API calls, execution logic,
types, and constants each live in their own folder.

### Why files were separated
- `components/` keeps reusable UI pieces separate from app coordination logic.
- `components/nodes/` keeps React Flow custom node UI in one clear place.
- `hooks/` keeps React state and React Flow event handling logic reusable.
- `services/` keeps backend API/fetch code separate from UI code.
- `utils/` keeps plain execution/helper logic separate from React rendering.
- `types/` keeps shared TypeScript types in one place.
- `constants/` keeps fixed mappings/configuration, such as React Flow node types.

### Which file has which logic
- `frontend/src/App.tsx` renders the app layout, toolbar, and `ReactFlow`. It
  imports the hook, API helpers, flow engine, and node types, then connects them
  together.
- `frontend/src/components/nodes/ManualNode.tsx` contains the Manual Input node UI.
  It shows an input field and sends value changes through `props.data.onChange`.
- `frontend/src/components/nodes/TransformNode.tsx` contains the Transform node UI.
  It shows the template input, uppercase checkbox, input handle, and output handle.
- `frontend/src/components/nodes/LogNode.tsx` contains the Log / Preview node UI.
  It displays the final result and has an input handle.
- `frontend/src/components/nodes/nodeStyles.ts` contains shared node styles used by
  the custom node components.
- `frontend/src/constants/nodeTypes.ts` maps React Flow node names to components:
  `manual`, `transform`, and `log`.
- `frontend/src/hooks/useFlow.ts` contains flow state logic: `nodes`, `edges`,
  `flowId`, `patchNode`, `decorate`, node dragging, edge connecting, and `addNode`.
- `frontend/src/services/flowApi.ts` contains API communication only:
  `loadFlow()`, `saveFlow()`, and `reloadFlow()`.
- `frontend/src/utils/flowEngine.ts` contains the existing `runFlow` execution
  logic. It processes nodes and updates Log node results.
- `frontend/src/types/flow.ts` contains shared TypeScript types used by multiple
  files.

### How the files connect

```text
App.tsx
  -> calls useFlow() from hooks/useFlow.ts
  -> imports nodeTypes from constants/nodeTypes.ts
  -> calls API helpers from services/flowApi.ts
  -> calls runFlow from utils/flowEngine.ts
  -> renders ReactFlow

constants/nodeTypes.ts
  -> imports ManualNode, TransformNode, LogNode
  -> gives React Flow the component for each node type

ReactFlow
  -> receives nodes and edges from useFlow()
  -> checks each node.type
  -> renders the matching custom node component

Node components
  -> read values from props.data
  -> call props.data.onChange when edited

useFlow.ts
  -> patchNode updates the correct node data
  -> onNodesChange handles dragging/moving nodes
  -> onConnect creates edges between node handles
```

Tanglish summary: `App.tsx` manager maari irukku. `useFlow.ts` state brain,
`flowApi.ts` backend calls, `flowEngine.ts` run logic, `components/nodes` node UI,
`nodeTypes.ts` React Flow mapping, `types/flow.ts` shared types. Ippadi separate
pannina code easy ah find, understand, and maintain panna mudiyum.

## Recent safe refactors

### Type safety refactor
- Replaced active `any` usage with meaningful TypeScript types.
- Added shared flow types in `frontend/src/types/flow.ts`.
- Typed node props, API responses, payloads, React Flow handlers, and state
  updater functions.
- Behavior did not change; only TypeScript safety improved.

### Duplicate code refactor
- Moved repeated node styles into `frontend/src/components/nodes/nodeStyles.ts`.
- Reused the same style constants in `ManualNode`, `TransformNode`, and `LogNode`.
- Added a small `readJson()` helper in `frontend/src/services/flowApi.ts` for
  repeated JSON parsing.
- Behavior and UI stayed the same.

### Readability naming refactor
- Renamed short local variables and parameters to clearer names.
- Examples: `nds` became `currentNodes`, `eds` became `currentEdges`, `chs` became
  `changes`, `f` became `flow`, and `r` became `response`.
- Exported functions and React component names were not changed.

### Async/await refactor
- Converted Promise `.then()` chains to `async/await` in `App.tsx` and
  `flowApi.ts`.
- API endpoints, request payloads, and execution order stayed the same.
- No error handling or feature behavior was changed.

## What I fixed
- Fixed the React Flow crash caused by missing node `position` data.
- Normalized loaded nodes so they always have a fallback `position: { x: 0, y: 0 }`.
- Saved node positions along with node data so saved flows reload safely.







## Feature: HTTP/Webhook Output Node

### Overview

I implemented a new **Webhook Output Node** that allows a workflow to send the processed result to an external HTTP endpoint when the flow is executed.

The node supports:

- Configurable Destination URL
- Configurable HTTP Method (GET, POST, PUT)
- Execution status (Success / Failed / Network Error)

This satisfies the requirement of sending the processed output to an external endpoint and displaying the outcome inside the application.

---

### Design

The Webhook node acts as an **Output Node**.

During execution, it receives the processed value from the previous node (typically a Transform node) and sends that value to an external HTTP endpoint.

Example workflow:

Manual Input
      │
      ▼
Transform
      │
      ├────────► Log
      │
      └────────► Webhook

The Log node displays the processed value, while the Webhook node sends the same value to an external system.

---

### Architecture

Initially, the webhook request was implemented directly from the React frontend.

However, browser CORS restrictions prevented requests to external domains.

To make the implementation more reliable and closer to a production architecture, I moved the external HTTP request logic to the Express backend.

Current flow:

React Frontend
        │
        ▼
POST /api/webhook
        │
        ▼
Express Backend
        │
        ▼
External Webhook Endpoint
        │
        ▼
HTTP Response
        │
        ▼
Frontend Status Update

This approach avoids browser CORS issues and centralizes outbound HTTP communication in the backend.

---

### Backend Implementation

A new API endpoint was added:

POST /api/webhook

The endpoint:

- validates the destination URL
- validates the HTTP method
- performs the external HTTP request using the native Node.js fetch() API
- returns the HTTP status back to the frontend

For POST and PUT requests, the payload is sent as:

```json
{
  "result": "<processed output>"
}