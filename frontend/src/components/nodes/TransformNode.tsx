import { Handle, Position } from 'reactflow'
import type { FlowNodeProps } from '../../types/flow'
import { checkboxLabelStyle, checkboxStyle, nodeBaseStyle, nodeHeaderColors, nodeHeaderStyle, nodeInputStyle } from './nodeStyles'

function TransformNode(props: FlowNodeProps) {
  return (
    <div className="flow-node-card" style={{ ...nodeBaseStyle, width: 210 }}>
      <div style={{ ...nodeHeaderStyle, background: nodeHeaderColors.transform }}>🔄Transform</div>
      <input
        className="node-field"
        value={props.data.template}
        onChange={(event) => props.data.onChange(props.id, { template: event.target.value })}
        style={nodeInputStyle}
      />
      <label style={checkboxLabelStyle}>
        <input
          type="checkbox"
          checked={!!props.data.upper}
          onChange={(event) => props.data.onChange(props.id, { upper: event.target.checked })}
          style={checkboxStyle}
        /> uppercase
      </label>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

export default TransformNode
