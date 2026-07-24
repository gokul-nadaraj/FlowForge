import type { Dispatch, SetStateAction } from 'react'
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  NodeProps
} from 'reactflow'

// Node types
export type NodeKind = 'manual' | 'transform' | 'log' | 'webhook'

// Supported webhook methods
export type WebhookMethod = 'POST' | 'PUT' | 'GET'

// Common editable properties for nodes
export interface FlowPatch {
  value?: string
  template?: string
  upper?: boolean
  result?: string
  url?: string
  method?: WebhookMethod
  webhookStatus?: string
}

// Runtime node data (used inside React Flow)
export interface FlowNodeData extends FlowPatch {
  type: string
  onChange: (id: string, patch: FlowPatch) => void
}

// React Flow types
export type FlowNode = Node<FlowNodeData>
export type FlowEdge = Edge
export type FlowNodeProps = NodeProps<FlowNodeData>
export type FlowNodeChange = NodeChange[]
export type FlowEdgeChange = EdgeChange[]
export type FlowConnection = Connection
export type SetFlowNodes = Dispatch<SetStateAction<FlowNode[]>>

// Saved node data (stored in JSON)
export interface SavedFlowNodeData extends FlowPatch {
  type: string
}

// Saved node
export interface SavedFlowNode {
  id: string
  type?: string
  position?: {
    x: number
    y: number
  }
  data: SavedFlowNodeData
}

// Save payload
export interface FlowPayload {
  name: string
  nodes: SavedFlowNode[]
  edges: FlowEdge[]
}

// Backend response
export interface FlowResponse {
  id: string
  nodes?: SavedFlowNode[]
  edges: FlowEdge[]
}

// Webhook request payload
export interface WebhookPayload {
  url: string
  method: WebhookMethod
  result: string
}

// Webhook response
export interface WebhookResponse {
  success: boolean
  status: number
  message?: string
}