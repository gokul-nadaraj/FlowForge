import { Handle, Position } from 'reactflow'
import type { FlowNodeProps } from '../../types/flow'
import { nodeBaseStyle, nodeHeaderStyle, nodeInputStyle } from './nodeStyles'

function ManualNode(props: FlowNodeProps) {
  return (
    <div style={{ ...nodeBaseStyle, width: 160 }}>
      <div style={nodeHeaderStyle}>Manual Input</div>
      <input
        value={props.data.value}
        onChange={(event) => props.data.onChange(props.id, { value: event.target.value })}
        style={nodeInputStyle}
      />
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export default ManualNode
