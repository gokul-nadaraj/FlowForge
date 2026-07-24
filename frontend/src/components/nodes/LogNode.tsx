import { Handle, Position } from 'reactflow'
import type { FlowNodeProps } from '../../types/flow'
import { nodeBaseStyle, nodeHeaderStyle } from './nodeStyles'

function LogNode(props: FlowNodeProps) {
  return (
    <div style={{ ...nodeBaseStyle, width: 180 }}>
      <div style={nodeHeaderStyle}>Log / Preview</div>
      <div style={{ fontSize: 13, minHeight: 18, wordBreak: 'break-all' }}>{props.data.result}</div>
      <Handle type="target" position={Position.Left} />
    </div>
  )
}

export default LogNode
