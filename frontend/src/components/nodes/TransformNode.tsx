import { Handle, Position } from 'reactflow'
import type { FlowNodeProps } from '../../types/flow'
import { nodeBaseStyle, nodeHeaderStyle, nodeInputStyle, nodeLabelStyle } from './nodeStyles'

function TransformNode(props: FlowNodeProps) {
  return (
    <div style={{ ...nodeBaseStyle, width: 180 }}>
      <div style={nodeHeaderStyle}>Transform</div>
      <input
        value={props.data.template}
        onChange={(event) => props.data.onChange(props.id, { template: event.target.value })}
        style={nodeInputStyle}
      />
      <label style={nodeLabelStyle}>
        <input
          type="checkbox"
          checked={!!props.data.upper}
          onChange={(event) => props.data.onChange(props.id, { upper: event.target.checked })}
        /> uppercase
      </label>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export default TransformNode
