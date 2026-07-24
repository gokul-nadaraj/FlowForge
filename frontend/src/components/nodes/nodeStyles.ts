import type { CSSProperties } from 'react'

export const nodeBaseStyle: CSSProperties = {
  padding: 14,
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  background: '#ffffff',
  boxShadow: '0 10px 24px rgba(15, 23, 42, 0.1)'
}

export const nodeHeaderStyle: CSSProperties = {
  borderRadius: 9,
  color: '#ffffff',
  fontSize: 14,
  fontWeight: 800,
  marginBottom: 12,
  padding: '9px 11px'
}

export const nodeInputStyle: CSSProperties = {
  width: '100%'
}

export const nodeLabelStyle: CSSProperties = {
  color: '#475569',
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 6
}

export const checkboxLabelStyle: CSSProperties = {
  alignItems: 'center',
  color: '#334155',
  display: 'flex',
  fontSize: 13,
  fontWeight: 700,
  gap: 8,
  marginTop: 10
}

export const checkboxStyle: CSSProperties = {
  accentColor: '#f97316',
  height: 16,
  margin: 0,
  width: 16
}

export const logValueStyle: CSSProperties = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  color: '#172033',
  fontSize: 13,
  lineHeight: 1.45,
  minHeight: 42,
  padding: '10px 11px',
  wordBreak: 'break-all'
}

export const webhookStatusLabelStyle: CSSProperties = {
  color: '#64748b',
  fontSize: 12,
  fontWeight: 800,
  marginBottom: 6,
  marginTop: 10
}

export const statusBadgeBaseStyle: CSSProperties = {
  borderRadius: 999,
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 800,
  lineHeight: 1,
  minHeight: 24,
  padding: '6px 10px'
}

export const nodeHeaderColors = {
  manual: '#2563eb',
  transform: '#f97316',
  log: '#059669',
  webhook: '#7c3aed'
}

export function getWebhookStatusStyle(status: string): CSSProperties {
  const normalizedStatus = status.toLowerCase()

  if (normalizedStatus.includes('sending')) {
    return { background: '#fef3c7', color: '#92400e' }
  }

  if (normalizedStatus.includes('success')) {
    return { background: '#dcfce7', color: '#166534' }
  }

  if (normalizedStatus.includes('url required')) {
    return { background: '#ffedd5', color: '#9a3412' }
  }

  if (normalizedStatus.includes('failed') || normalizedStatus.includes('network error')) {
    return { background: '#fee2e2', color: '#991b1b' }
  }

  return { background: '#e2e8f0', color: '#475569' }
}
