import { useCallback, useState } from 'react'
import { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow'
import type {
  FlowConnection,
  FlowEdge,
  FlowEdgeChange,
  FlowNode,
  FlowNodeChange,
  FlowNodeData,
  FlowPatch,
  NodeKind,
  SavedFlowNode
} from '../types/flow'

let nodeIdCounter = 100
function newId() { nodeIdCounter++; return 'n' + nodeIdCounter }

export default function useFlow() {
  const [nodes, setNodes] = useState<FlowNode[]>([])
  const [edges, setEdges] = useState<FlowEdge[]>([])
  const [flowId, setFlowId] = useState<string>('seed')
  const [flowName] = useState<string>('Hello Flow')
  const defaultPosition = { x: 0, y: 0 }

  const patchNode = useCallback((id: string, patch: FlowPatch) => {
    setNodes((currentNodes) => currentNodes.map((node) => node.id === id ? { ...node, data: { ...node.data, ...patch } } : node))
  }, [])


  function decorate(list: SavedFlowNode[]): FlowNode[] {
    return list.map((node) => ({
      ...node,
      position: node.position || defaultPosition,
      data: {
        ...node.data,
        webhookStatus: node.data.type === 'webhook' ? 'Waiting...' : undefined,
        onChange: patchNode
      }
    }))
  }

  const onNodesChange = useCallback((changes: FlowNodeChange) => setNodes((currentNodes) => applyNodeChanges(changes, currentNodes)), [])
  const onEdgesChange = useCallback((changes: FlowEdgeChange) => setEdges((currentEdges) => applyEdgeChanges(changes, currentEdges)), [])
  const onConnect = useCallback((connection: FlowConnection) => setEdges((currentEdges) => addEdge(connection, currentEdges)), [])

  function addNode(kind: NodeKind) {
    const id = newId()
    let data: FlowNodeData = { type: kind, onChange: patchNode }
    if (kind === 'manual') data = { ...data, value: 'text' }
    if (kind === 'transform') data = { ...data, template: '{{input}}', upper: false }
    if (kind === 'log') data = { ...data, result: '' }
    if (kind === 'webhook') data = { ...data, url: '', method: 'POST', webhookStatus: 'Waiting...' }
    const node: FlowNode = { id, type: kind, position: { x: 200 + Math.random() * 200, y: 220 + Math.random() * 80 }, data }
    setNodes((currentNodes) => currentNodes.concat(node))
  }

  return {
    nodes,
    setNodes,
    edges,
    setEdges,
    flowId,
    setFlowId,
    flowName,
    defaultPosition,
    patchNode,
    decorate,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode
  }
}
