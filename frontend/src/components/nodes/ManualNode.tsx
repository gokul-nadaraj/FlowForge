import { Handle, Position } from 'reactflow'
import type { FlowNodeProps } from '../../types/flow'
import { nodeBaseStyle, nodeHeaderColors, nodeHeaderStyle, nodeInputStyle } from './nodeStyles'

function ManualNode(props: FlowNodeProps) {
  return (
    <div className="flow-node-card" style={{ ...nodeBaseStyle, width: 190 }}>
      <div style={{ ...nodeHeaderStyle, background: nodeHeaderColors.manual }}>📝 Manual Input</div>
      <input
        className="node-field"
        value={props.data.value}
        onChange={(event) => props.data.onChange(props.id, { value: event.target.value })}
        style={nodeInputStyle}
      />
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export default ManualNode
