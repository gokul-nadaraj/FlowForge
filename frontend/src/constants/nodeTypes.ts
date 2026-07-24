import type { NodeTypes } from 'reactflow'
import ManualNode from '../components/nodes/ManualNode'
import TransformNode from '../components/nodes/TransformNode'
import LogNode from '../components/nodes/LogNode'
import WebhookNode from '../components/nodes/WebhookNode'

const nodeTypes: NodeTypes = { manual: ManualNode, transform: TransformNode, log: LogNode, webhook: WebhookNode }

export default nodeTypes
