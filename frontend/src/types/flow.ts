import type { Dispatch, SetStateAction } from 'react'
import type { Connection, Edge, EdgeChange, Node, NodeChange, NodeProps } from 'reactflow'

export type NodeKind = 'manual' | 'transform' | 'log' | 'webhook'
export type WebhookMethod = 'POST' | 'PUT' | 'GET'

export interface FlowPatch {
  value?: string
  template?: string
  upper?: boolean
  result?: string
  url?: string
  method?: WebhookMethod
  webhookStatus?: string
}

export interface FlowNodeData extends FlowPatch {
  type: string
  onChange: (id: string, patch: FlowPatch) => void
}

export type FlowNode = Node<FlowNodeData>
export type FlowEdge = Edge
export type FlowNodeProps = NodeProps<FlowNodeData>
export type FlowNodeChange = NodeChange[]
export type FlowEdgeChange = EdgeChange[]
export type FlowConnection = Connection
export type SetFlowNodes = Dispatch<SetStateAction<FlowNode[]>>

export interface SavedFlowNodeData extends Omit<FlowPatch, 'webhookStatus'> {
  type: string
}

export interface SavedFlowNode {
  id: string
  type?: string
  position?: {
    x: number
    y: number
  }
  data: SavedFlowNodeData
}

export interface FlowPayload {
  name: string
  nodes: SavedFlowNode[]
  edges: FlowEdge[]
}

export interface FlowResponse {
  id: string
  nodes?: SavedFlowNode[]
  edges: FlowEdge[]
}

export interface WebhookPayload {
  url: string
  method: WebhookMethod
  result: string
}

export interface WebhookResponse {
  success: boolean
  status: number
  message?: string
}
