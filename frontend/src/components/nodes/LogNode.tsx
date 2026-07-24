import { Handle, Position } from 'reactflow'
import type { FlowNodeProps } from '../../types/flow'
import { logValueStyle, nodeBaseStyle, nodeHeaderColors, nodeHeaderStyle } from './nodeStyles'

function LogNode(props: FlowNodeProps) {
  return (
    <div className="flow-node-card" style={{ ...nodeBaseStyle, width: 210 }}>
      <div style={{ ...nodeHeaderStyle, background: nodeHeaderColors.log }}>📄 Log / Preview</div>
      <div style={logValueStyle}>{props.data.result}</div>
      <Handle type="target" position={Position.Left} />
    </div>
  )
}

export default LogNode
