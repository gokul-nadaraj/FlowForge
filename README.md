# FlowForge

A small node-based automation builder. Add nodes to the canvas, connect them, and run
the flow. Flows are saved as JSON on disk. See `problem-statement.pdf` for your task.

## Requirements
- Node.js 18+

## Run

Open two terminals.

**Backend**
```
cd backend
npm install
npm run dev
```
Backend runs on http://localhost:3001

**Frontend**
```
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173 — open it in your browser.

## Using the app
- Use the toolbar buttons to add Input, Transform, and Log nodes.
- Drag from a node's right handle to another node's left handle to connect them.
- Click **Run** to execute the flow; the Log node shows the result.
- Click **Save** to persist the flow and **Reload** to load it from the server.

## Notes

For additional implementation details, please refer to `node.md`, which documents the frontend architecture, node execution flow, file organization, and key refactoring decisions.