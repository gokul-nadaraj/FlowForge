import { Handle, Position } from 'reactflow'
import type { FlowNodeProps, WebhookMethod } from '../../types/flow'
import {
  getWebhookStatusStyle,
  nodeBaseStyle,
  nodeHeaderColors,
  nodeHeaderStyle,
  nodeInputStyle,
  nodeLabelStyle,
  statusBadgeBaseStyle,
  webhookStatusLabelStyle
} from './nodeStyles'

const webhookMethods: WebhookMethod[] = ['POST', 'PUT', 'GET']
// This is a React component that represents a Webhook node in a flowchart or workflow application.
function WebhookNode(props: FlowNodeProps) {
  const webhookStatus = props.data.webhookStatus || 'Waiting...'

  return (
    <div className="flow-node-card" style={{ ...nodeBaseStyle, width: 250 }}>
      <div style={{ ...nodeHeaderStyle, background: nodeHeaderColors.webhook }}>🌐 Webhook</div>
      <label style={nodeLabelStyle}>
        Destination URL
        <input
          className="node-field"
          value={props.data.url || ''}
          placeholder="https://example.com/webhook"
          onChange={(event) => props.data.onChange(props.id, { url: event.target.value })}
          style={nodeInputStyle}
        />
      </label>
      <label style={{ ...nodeLabelStyle, marginTop: 10 }}>
        Method
        <select
          className="node-select"
          value={props.data.method || 'POST'}
          onChange={(event) => props.data.onChange(props.id, { method: event.target.value as WebhookMethod })}
          style={nodeInputStyle}
        >
          {webhookMethods.map((method) => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </label>
      <div style={webhookStatusLabelStyle}>Status</div>
      <div style={{ ...statusBadgeBaseStyle, ...getWebhookStatusStyle(webhookStatus) }}>{webhookStatus}</div>
      <Handle type="target" position={Position.Left} />
    </div>
  )
}

export default WebhookNode
