import { useEffect, useState } from 'react'
import ReactFlow, { Background, Controls } from 'reactflow'
import nodeTypes from './constants/nodeTypes'
import useFlow from './hooks/useFlow'
import { loadFlow, saveFlow as saveFlowApi, reloadFlow } from './services/flowApi'
import type { FlowPayload } from './types/flow'
import { runFlow as runFlowEngine } from './utils/flowEngine'
import { Toaster, toast } from 'react-hot-toast';

const appShellStyle = {
  background: '#f4f7fb',
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw'
} as const

const toolbarStyle = {
  alignItems: 'center',
  background: '#ffffff',
  boxShadow: '0 6px 22px rgba(15, 23, 42, 0.08)',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
  minHeight: 60,
  padding: '10px 18px',
  position: 'relative',
  zIndex: 5
} as const

const titleStyle = {
  color: '#172033',
  fontSize: 20,
  fontWeight: 900,
  letterSpacing: 0,
  marginRight: 10
} as const

const buttonGroupStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
  marginLeft: 'auto'
} as const

const flowAreaStyle = {
  flex: 1,
  minHeight: 0
} as const

const buttonColors = {
  input: '#4f46e5',
  transform: '#f97316',
  log: '#059669',
  webhook: '#7c3aed',
  run: '#16a34a',
  save: '#2563eb',
  reload: '#64748b'
}

export default function App() {

  const {
    nodes,
    setNodes,
    edges,
    setEdges,
    flowId,
    setFlowId,
    flowName,
    defaultPosition,
    decorate,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode
  } = useFlow()


 

 

  useEffect(() => {
    async function fetchInitialFlow() {
      try {
        const flow = await loadFlow()
        if (!flow) return
        setFlowId(flow.id)
        setNodes(decorate(flow.nodes || []))
        setEdges(flow.edges)
      } catch (error) {
        console.error('Failed to load flow', error)
    toast.error('Failed to load flow.')
      }
    }

    fetchInitialFlow()
  }, [])

async function runFlow() {
  await runFlowEngine(nodes, edges, setNodes)

}


  function saveFlow() {
    const hasInvalidWebhook = nodes.some(
  node =>
    node.data.type === 'webhook' &&
    !(node.data.url || '').trim()
);

if (hasInvalidWebhook) {
  toast.error('Please enter a Webhook URL before saving.');
  return;
}
    const payload: FlowPayload = {
      name: flowName,
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position || defaultPosition,
        data: { type: node.data.type, value: node.data.value, template: node.data.template, upper: node.data.upper, result: node.data.result, url: node.data.url, method: node.data.method ,webhookStatus: node.data.webhookStatus}
      })),
      edges: edges
    }

    async function persistFlow() {
      try {
        await saveFlowApi(flowId, payload)
   toast.success('Flow saved successfully.')
      } catch (error) {
        console.error('Failed to save flow', error)
        toast.error('Save failed. Your changes were not saved.')
      }
    }

    persistFlow()
  }

  function reload() {
    async function fetchFlow() {
      try {
        const flow = await reloadFlow(flowId)
        setNodes(decorate(flow.nodes || []))
        setEdges(flow.edges)
      toast.success('Flow reloaded successfully.')
      } catch (error) {
        console.error('Failed to reload flow', error)
       toast.error('Failed to reload flow.')
      }
    }

    fetchFlow()
  }

  return (
   <>


   <Toaster
  position="top-center"
  toastOptions={{
    duration: 3000,
    style: {
      borderRadius: '10px',
      background: '#050202',
      color: '#ffffff',
      boxShadow: '0 8px 20px rgba(0,0,0,.12)'
    }
  }}
/>
    <div style={appShellStyle}>
      <div style={toolbarStyle}>
        <div style={titleStyle}>FlowForge</div>
        <button className="app-button" style={{ background: buttonColors.input }} onClick={() => addNode('manual')}>+ Input</button>
        <button className="app-button" style={{ background: buttonColors.transform }} onClick={() => addNode('transform')}>+ Transform</button>
        <button className="app-button" style={{ background: buttonColors.log }} onClick={() => addNode('log')}>+ Log</button>
        <button className="app-button" style={{ background: buttonColors.webhook }} onClick={() => addNode('webhook')}>+ Webhook</button>
        <div style={buttonGroupStyle}>
          <button className="app-button" style={{ background: buttonColors.run }} onClick={runFlow}>Run</button>
          <button className="app-button" style={{ background: buttonColors.save }} onClick={saveFlow}>Save</button>
          <button className="app-button" style={{ background: buttonColors.reload }} onClick={reload}>Reload</button>
        </div>
      </div>
    
      <div style={flowAreaStyle}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
   </>
  )
}
