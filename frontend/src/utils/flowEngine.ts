import type { FlowEdge, FlowNode, SetFlowNodes } from '../types/flow'
import { sendWebhook as sendWebhookApi } from '../services/flowApi'

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

// THE ENGINE: processes nodes in insertion order (Bug A)
export async function runFlow(nodes: FlowNode[], edges: FlowEdge[], setNodes: SetFlowNodes) {
  const outputs: Record<string, unknown> = {}
  let latestOutput: unknown = undefined
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    let inputVal: unknown = undefined
    for (let j = 0; j < edges.length; j++) {
      if (edges[j].target === node.id) inputVal = outputs[edges[j].source]
    }
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
      const webhookInput = inputVal === undefined ? latestOutput : inputVal
      await sendWebhook(node, webhookInput, setNodes)
      out = webhookInput
    }
    outputs[node.id] = out
    if (out !== undefined) latestOutput = out
  }
  setNodes((currentNodes: FlowNode[]) => currentNodes.map((node) => node.data.type === 'log'
    ? { ...node, data: { ...node.data, result: outputs[node.id] == null ? '' : String(outputs[node.id]) } }
    : node))
}
