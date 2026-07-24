import type { FlowPayload, FlowResponse, WebhookPayload, WebhookResponse } from '../types/flow'

function readJson<T>(response: Response): Promise<T> {
  return response.json()
}

//interface FlowApi 
export async function loadFlow(): Promise<FlowResponse | null> {
  const response = await fetch('/api/flows/seed')
  return readJson<FlowResponse | null>(response)
}

export async function saveFlow(flowId: string, payload: FlowPayload): Promise<FlowResponse> {
  const response = await fetch('/api/flows/' + flowId, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return readJson<FlowResponse>(response)
}

export async function reloadFlow(flowId: string): Promise<FlowResponse> {
  const response = await fetch('/api/flows/' + flowId)
  return readJson<FlowResponse>(response)
}

//webhook api

export async function sendWebhook(payload: WebhookPayload): Promise<WebhookResponse> {
  const response = await fetch('/api/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return readJson<WebhookResponse>(response)
}
