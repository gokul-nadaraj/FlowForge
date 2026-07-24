// import React, { useEffect, useState, useCallback } from 'react'
// import ReactFlow, {
//   Background, Controls, addEdge,
//   applyNodeChanges, applyEdgeChanges,
//   Handle, Position
// } from 'reactflow'

// // ---- messy on purpose: everything lives in this one file ----

// let idc = 100
// function newId() { idc++; return 'n' + idc }

// function ManualNode(props: any) {
//   return (
//     <div style={{ padding: 8, border: '1px solid #888', borderRadius: 6, background: '#fff', width: 160 }}>
//       <div style={{ fontSize: 11, color: '#666' }}>Manual Input</div>
//       <input
//         value={props.data.value}
//         onChange={(e) => props.data.onChange(props.id, { value: e.target.value })}
//         style={{ width: '100%' }}
//       />
//       <Handle type="source" position={Position.Right} />
//     </div>
//   )
// }

// function TransformNode(props: any) {
//   return (
//     <div style={{ padding: 8, border: '1px solid #888', borderRadius: 6, background: '#fff', width: 180 }}>
//       <div style={{ fontSize: 11, color: '#666' }}>Transform</div>
//       <input
//         value={props.data.template}
//         onChange={(e) => props.data.onChange(props.id, { template: e.target.value })}
//         style={{ width: '100%' }}
//       />
//       <label style={{ fontSize: 11 }}>
//         <input
//           type="checkbox"
//           checked={!!props.data.upper}
//           onChange={(e) => props.data.onChange(props.id, { upper: e.target.checked })}
//         /> uppercase
//       </label>
//       <Handle type="target" position={Position.Left} />
//       <Handle type="source" position={Position.Right} />
//     </div>
//   )
// }

// function LogNode(props: any) {
//   return (
//     <div style={{ padding: 8, border: '1px solid #888', borderRadius: 6, background: '#fff', width: 180 }}>
//       <div style={{ fontSize: 11, color: '#666' }}>Log / Preview</div>
//       <div style={{ fontSize: 13, minHeight: 18, wordBreak: 'break-all' }}>{props.data.result}</div>
//       <Handle type="target" position={Position.Left} />
//     </div>
//   )
// }

// const nodeTypes = { manual: ManualNode, transform: TransformNode, log: LogNode }

// export default function App() {
//   const [nodes, setNodes] = useState<any[]>([])
//   const [edges, setEdges] = useState<any[]>([])
//   const [flowId, setFlowId] = useState<string>('seed')
//   const [flowName] = useState<string>('Hello Flow')
//   const defaultPosition = { x: 0, y: 0 }

//   const patchNode = useCallback((id: string, patch: any) => {
//     setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, ...patch } } : n))
//   }, [])

//   function decorate(list: any[]) {
//     return list.map((n) => ({
//       ...n,
//       position: n.position || defaultPosition,
//       data: { ...n.data, onChange: patchNode }
//     }))
//   }

//   useEffect(() => {
//     fetch('/api/flows/seed')
//       .then((r) => r.json())
//       .then((f) => {
//         if (!f) return
//         setFlowId(f.id)
//         setNodes(decorate(f.nodes || []))
//         setEdges(f.edges)
//       })
//   }, [])

//   const onNodesChange = useCallback((chs: any) => setNodes((nds) => applyNodeChanges(chs, nds)), [])
//   const onEdgesChange = useCallback((chs: any) => setEdges((eds) => applyEdgeChanges(chs, eds)), [])
//   const onConnect = useCallback((c: any) => setEdges((eds) => addEdge(c, eds)), [])

//   function addNode(kind: string) {
//     const id = newId()
//     let data: any = { type: kind, onChange: patchNode }
//     if (kind === 'manual') data = { ...data, value: 'text' }
//     if (kind === 'transform') data = { ...data, template: '{{input}}', upper: false }
//     if (kind === 'log') data = { ...data, result: '' }
//     const node = { id, type: kind, position: { x: 200 + Math.random() * 200, y: 220 + Math.random() * 80 }, data }
//     setNodes((nds) => nds.concat(node))
//   }

//   // THE ENGINE: synchronous, processes nodes in insertion order (Bug A)
//   function runFlow() {
//     const outputs: any = {}
//     for (let i = 0; i < nodes.length; i++) {
//       const node = nodes[i]
//       let inputVal: any = undefined
//       for (let j = 0; j < edges.length; j++) {
//         if (edges[j].target === node.id) inputVal = outputs[edges[j].source]
//       }
//       let out: any
//       const t = node.data.type
//       if (t === 'manual') {
//         out = node.data.value
//       } else if (t === 'transform') {
//         let s = String(node.data.template).split('{{input}}').join(inputVal == null ? '' : String(inputVal))
//         if (node.data.upper) s = s.toUpperCase()
//         out = s
//       } else if (t === 'log') {
//         out = inputVal
//       }
//       outputs[node.id] = out
//     }
//     setNodes((nds) => nds.map((n) => n.data.type === 'log'
//       ? { ...n, data: { ...n.data, result: outputs[n.id] == null ? '' : String(outputs[n.id]) } }
//       : n))
//   }

//   // save current flow (Bug B: payload drops node.position)
//   function saveFlow() {
//     const payload = {
//       name: flowName,
//       nodes: nodes.map((n) => ({
//         id: n.id,
//         type: n.type,
//         position: n.position || defaultPosition,
//         data: { type: n.data.type, value: n.data.value, template: n.data.template, upper: n.data.upper, result: n.data.result }
//       })),
//       edges: edges
//     }
//     fetch('/api/flows/' + flowId, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload)
//     }).then((r) => r.json()).then(() => console.log('saved'))
//   }

//   function reload() {
//     fetch('/api/flows/' + flowId)
//       .then((r) => r.json())
//       .then((f) => {
//         setNodes(decorate(f.nodes || []))
//         setEdges(f.edges)
//       })
//   }

//   return (
//     <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
//       <div style={{ padding: 8, borderBottom: '1px solid #ccc', display: 'flex', gap: 8, alignItems: 'center' }}>
//         <b>FlowForge</b>
//         <button onClick={() => addNode('manual')}>+ Input</button>
//         <button onClick={() => addNode('transform')}>+ Transform</button>
//         <button onClick={() => addNode('log')}>+ Log</button>
//         <span style={{ flex: 1 }} />
//         <button onClick={runFlow}>Run</button>
//         <button onClick={saveFlow}>Save</button>
//         <button onClick={reload}>Reload</button>
//       </div>
//       <div style={{ flex: 1 }}>
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           nodeTypes={nodeTypes}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           fitView
//         >
//           <Background />
//           <Controls />
//         </ReactFlow>
//       </div>
//     </div>
//   )
// }
