
# Code Improvements

I cleaned the project structure to make it easier to understand and maintain.

- Separated logic into hooks, services, utils, types, constants and components.
- Removed repeated code where possible.
- Added proper TypeScript types instead of using any.
- Improved variable names and code readability.
- Used async/await for API calls.


# Bugs Fixed

## Node position

After saving and reloading, some nodes lost their position.

Fix:
- Saved node position in the flow JSON.
- Added a default position while loading.




## Flow execution order

The flow was running based on the node array order instead of the connections.

Fix:
- Built the execution order from graph connections.
- Each node now runs only after its parent node is completed.
- Used topological sorting (Kahn's Algorithm).




# New Feature - Webhook Output Node

Added a new *Webhook* output node.

Features:

- Enter destination URL
- Select HTTP Method (POST / PUT / GET)
- Sends processed result to external endpoint
- Shows execution status
- Success
- Failed
- Network Error

Flow example:

Manual
   │
   ▼
Transform
  ├──► Log
  └──► Webhook


# Webhook Backend  Excution

Instead of calling external APIs directly from React, the frontend calls the Express backend.

Flow:

React
→ Express API
→ External Webhook
→ Response
→ Update node status

This avoids browser CORS issues and keeps HTTP logic in the backend.

---

# Toast Notifications

Added toast messages for better user feedback.

- Flow Saved
- Flow Reloaded
- Flow Executed Successfully
- Webhook URL Required
- Save Failed
- Reload Failed

---

# Trade-offs

 I kept the backend simple.

- JSON file used as storage.
- No database.
- No authentication.
- No deployment.


# Key Decisions

- Split frontend logic into smaller reusable files.
- Used graph-based execution instead of node array order.
- Implemented the Webhook request through the Express backend to avoid browser CORS issues.
- Kept the existing UI behavior while improving the internal code structure.


# Future Enhancements

- User Authentication
- Database (MongoDB / PostgreSQL)
- Flow execution history
- Multiple saved workflows
- Flow import/export (JSON)
- Delete and duplicate nodes
- Retry option for failed webhooks
- Custom request headers and authentication tokens
- Request body editor for Webhook node
- Flow templates
- Undo / Redo
- Zoom shortcuts
- Search nodes
- Unit tests
- Integration tests
- Better error logging
- Dark mode
- Docker support
- Deployment to cloud (Vercel + Render / AWS)


# Final

The application now supports:

- Manual Input Node
- Transform Node
- Log Node
- Webhook Output Node
- Save Flow
- Reload Flow
- Graph-based execution
- HTTP Webhook requests
- Toast notifications
- Fixed bugs
- Better TypeScript structure


