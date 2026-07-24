import { useEffect, useState } from 'react'
import ReactFlow, { Background, Controls } from 'reactflow'
import nodeTypes from './constants/nodeTypes'
import useFlow from './hooks/useFlow'
import { loadFlow, saveFlow as saveFlowApi, reloadFlow } from './services/flowApi'
import type { FlowPayload } from './types/flow'
import { runFlow as runFlowEngine } from './utils/flowEngine'

export default function App() {
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState<'success' | 'error'>('success')
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

  function showStatus(message: string, tone: 'success' | 'error') {
    setStatusTone(tone)
    setStatusMessage(message)
  }

  useEffect(() => {
    if (!statusMessage) return

    const timerId = window.setTimeout(() => {
      setStatusMessage('')
    }, 3000)

    return () => window.clearTimeout(timerId)
  }, [statusMessage])

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
        showStatus('Could not load the saved flow.', 'error')
      }
    }

    fetchInitialFlow()
  }, [])

  async function runFlow() {
    await runFlowEngine(nodes, edges, setNodes)
  }

  // save current flow (Bug B: payload drops node.position)
  function saveFlow() {
    const payload: FlowPayload = {
      name: flowName,
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position || defaultPosition,
        data: { type: node.data.type, value: node.data.value, template: node.data.template, upper: node.data.upper, result: node.data.result, url: node.data.url, method: node.data.method }
      })),
      edges: edges
    }

    async function persistFlow() {
      try {
        await saveFlowApi(flowId, payload)
        showStatus('Flow saved.', 'success')
      } catch (error) {
        console.error('Failed to save flow', error)
        showStatus('Save failed. Your changes were not saved.', 'error')
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
        showStatus('Flow reloaded.', 'success')
      } catch (error) {
        console.error('Failed to reload flow', error)
        showStatus('Reload failed. The latest flow could not be loaded.', 'error')
      }
    }

    fetchFlow()
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 8, borderBottom: '1px solid #ccc', display: 'flex', gap: 8, alignItems: 'center' }}>
        <b>FlowForge</b>
        <button onClick={() => addNode('manual')}>+ Input</button>
        <button onClick={() => addNode('transform')}>+ Transform</button>
        <button onClick={() => addNode('log')}>+ Log</button>
        <button onClick={() => addNode('webhook')}>+ Webhook</button>
        <span style={{ flex: 1 }} />
        <button onClick={runFlow}>Run</button>
        <button onClick={saveFlow}>Save</button>
        <button onClick={reload}>Reload</button>
      </div>
      {statusMessage && (
        <div
          role={statusTone === 'error' ? 'alert' : 'status'}
          style={{
            position: 'fixed',
            top: 52,
            right: 16,
            zIndex: 10,
            maxWidth: 320,
            padding: '10px 12px',
            borderRadius: 6,
            border: statusTone === 'error' ? '1px solid #f0b4b4' : '1px solid #b9ddb9',
            background: statusTone === 'error' ? '#fff4f4' : '#f3fbf3',
            color: statusTone === 'error' ? '#8a1f1f' : '#1f6b2a',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.16)',
            fontSize: 13,
            lineHeight: 1.35
          }}
        >
          {statusMessage}
        </div>
      )}
      <div style={{ flex: 1 }}>
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
  )
}
