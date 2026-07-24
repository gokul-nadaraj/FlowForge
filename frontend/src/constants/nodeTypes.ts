import type { NodeTypes } from 'reactflow'
import ManualNode from '../components/nodes/ManualNode'
import TransformNode from '../components/nodes/TransformNode'
import LogNode from '../components/nodes/LogNode'
import WebhookNode from '../components/nodes/WebhookNode'

const nodeTypes: NodeTypes = { manual: ManualNode, transform: TransformNode, log: LogNode, webhook: WebhookNode }

export default nodeTypes

//Yes, this is a TypeScript file that defines a constant
//  `nodeTypes` which maps string keys to React components 
// representing different types of nodes in a flowchart
//  or workflow application.
//  The `NodeTypes` type is imported from the 'reactflow' library, ensuring that the `nodeTypes` object adheres to the expected structure for node types in the application. The components `ManualNode`, `TransformNode`, `LogNode`, and `WebhookNode` are imported from their respective paths and assigned to their corresponding keys in the `nodeTypes` object. Finally, the `nodeTypes` object is exported as the default export of the module.
