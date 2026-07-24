import type { FlowEdge, FlowNode, SetFlowNodes } from '../types/flow'
import { sendWebhook as sendWebhookApi } from '../services/flowApi'
import { toast } from 'react-hot-toast'

function updateWebhookStatus(setNodes: SetFlowNodes, nodeId: string, webhookStatus: string) {
  setNodes((currentNodes: FlowNode[]) => currentNodes.map((node) => node.id === nodeId
    ? { ...node, data: { ...node.data, webhookStatus } }
    : node))
}

// Sends a webhook request and updates the node's status
async function sendWebhook(node: FlowNode, inputVal: unknown, setNodes: SetFlowNodes) {
  const url = (node.data.url || '').trim()
  const method = node.data.method || 'POST'

  if (!url) {
    console.error('Webhook URL is missing for node', node.id)
    updateWebhookStatus(setNodes, node.id, '❌ Failed')
    return
  }

  updateWebhookStatus(setNodes, node.id, 'Sending...')

  try {
    const response = await sendWebhookApi({
      url,
      method,
      result: inputVal == null ? '' : String(inputVal)
    })

    updateWebhookStatus(setNodes, node.id, response.success ? `✅ Success (${response.status})` : `❌ Failed (${response.status})`)
  } catch (error) {
    console.error('Webhook request failed', error)
    updateWebhookStatus(setNodes, node.id, '❌ Network Error')
  }
}

interface GraphMaps {
  outgoingEdges: Record<string, FlowEdge[]>
  incomingEdges: Record<string, FlowEdge[]>
  inDegree: Record<string, number>
}

function buildGraphMaps(nodes: FlowNode[], edges: FlowEdge[]): GraphMaps {
  
  const nodeIds = new Set(nodes.map((node) => node.id))
  const outgoingEdges: Record<string, FlowEdge[]> = {}
  const incomingEdges: Record<string, FlowEdge[]> = {}
  const inDegree: Record<string, number> = {}

  
  for (const node of nodes) {
    outgoingEdges[node.id] = []
    incomingEdges[node.id] = []
    inDegree[node.id] = 0
  }

  for (const edge of edges) {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) continue

    outgoingEdges[edge.source].push(edge)
    incomingEdges[edge.target].push(edge)
    inDegree[edge.target] += 1
  }

  return { outgoingEdges, incomingEdges, inDegree }
}

function getExecutionOrder(nodes: FlowNode[], edges: FlowEdge[]): { orderedNodes: FlowNode[], incomingEdges: Record<string, FlowEdge[]> } {
  const { outgoingEdges, incomingEdges, inDegree } = buildGraphMaps(nodes, edges)
  const nodesById = new Map(nodes.map((node) => [node.id, node]))
  const queue = nodes.filter((node) => inDegree[node.id] === 0)
  const orderedNodes: FlowNode[] = []

  // Kahn's algorithm: source nodes run first, then children become 
  // runnable
  // only after every incoming edge has produced a parent output.
  for (let i = 0; i < queue.length; i++) {
    const node = queue[i]
    orderedNodes.push(node)

    for (const edge of outgoingEdges[node.id]) {
      inDegree[edge.target] -= 1

      if (inDegree[edge.target] === 0) {
        const targetNode = nodesById.get(edge.target)
        if (targetNode) queue.push(targetNode)
      }
    }
  }

  // A valid flow should be acyclic. If a cycle exists, keep the app responsive
  // by running the unresolved nodes after the graph-ordered portion.
  if (orderedNodes.length < nodes.length) {
    const orderedIds = new Set(orderedNodes.map((node) => node.id))
    orderedNodes.push(...nodes.filter((node) => !orderedIds.has(node.id)))
  }

  return { orderedNodes, incomingEdges }
}

function getNodeInput(node: FlowNode, incomingEdges: Record<string, FlowEdge[]>, outputs: Record<string, unknown>) {
  let inputVal: unknown = undefined

  // Preserve existing single-value behavior: if multiple parents connect to
  // a node, the last incoming edge in edge order supplies the node input.
  for (const edge of incomingEdges[node.id] || []) {
    inputVal = outputs[edge.source]
  }

  return inputVal
}



function validateWebhookUrls(nodes: FlowNode[], setNodes: SetFlowNodes) {
  const missingUrlNodeIds = nodes
    .filter((node) => node.data.type === 'webhook' && !(node.data.url || '').trim())
    .map((node) => node.id)

  if (missingUrlNodeIds.length === 0) return true

  const missingUrlNodeIdSet = new Set(missingUrlNodeIds)
  setNodes((currentNodes: FlowNode[]) => currentNodes.map((node) => missingUrlNodeIdSet.has(node.id)
    ? { ...node, data: { ...node.data, webhookStatus: 'URL required' } }
    : node))
toast.error('Please enter a Webhook URL before running.');

  return false
}

// THE ENGINE: processes nodes according to graph connections,
//  not array order.
export async function runFlow(nodes: FlowNode[], edges: FlowEdge[], setNodes: SetFlowNodes) {
  if (!validateWebhookUrls(nodes, setNodes)) return

  const outputs: Record<string, unknown> = {}
  const { orderedNodes, incomingEdges } = getExecutionOrder(nodes, edges)

  for (const node of orderedNodes) {
    const inputVal = getNodeInput(node, incomingEdges, outputs)
    let out: unknown
    const t = node.data.type

    if (t === 'manual') {
      out = node.data.value
    } else if (t === 'transform') {
      let s = String(node.data.template).split('{{input}}').join(inputVal == null ? '' : String(inputVal))
      if (node.data.upper) s = s.toUpperCase()
      out = s
    } else if (t === 'log') {
      out = inputVal
    } else if (t === 'webhook') {
      await sendWebhook(node, inputVal, setNodes)
      out = inputVal
    }

    outputs[node.id] = out
  }

  setNodes((currentNodes: FlowNode[]) => currentNodes.map((node) => node.data.type === 'log'
    ? { ...node, data: { ...node.data, result: outputs[node.id] == null ? '' : String(outputs[node.id]) } }
    : node))
}
