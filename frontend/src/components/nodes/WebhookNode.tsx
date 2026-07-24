import { Handle, Position } from 'reactflow'
import type { FlowNodeProps, WebhookMethod } from '../../types/flow'
import { nodeBaseStyle, nodeHeaderStyle, nodeInputStyle, nodeLabelStyle } from './nodeStyles'

const webhookMethods: WebhookMethod[] = ['POST', 'PUT', 'GET']

function WebhookNode(props: FlowNodeProps) {
  return (
    <div style={{ ...nodeBaseStyle, width: 220 }}>
      <div style={nodeHeaderStyle}>Webhook</div>
      <label style={nodeLabelStyle}>
        Destination URL
        <input
          value={props.data.url || ''}
          onChange={(event) => props.data.onChange(props.id, { url: event.target.value })}
          style={nodeInputStyle}
        />
      </label>
      <label style={{ ...nodeLabelStyle, display: 'block', marginTop: 6 }}>
        Method
        <select
          value={props.data.method || 'POST'}
          onChange={(event) => props.data.onChange(props.id, { method: event.target.value as WebhookMethod })}
          style={nodeInputStyle}
        >
          {webhookMethods.map((method) => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </label>
      <div style={{ ...nodeLabelStyle, marginTop: 6 }}>Status</div>
      <div style={{ fontSize: 13, minHeight: 18, wordBreak: 'break-word' }}>{props.data.webhookStatus || 'Waiting...'}</div>
      <Handle type="target" position={Position.Left} />
    </div>
  )
}

export default WebhookNode
