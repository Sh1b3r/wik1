import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#040816',
          color: '#ef4444',
          fontFamily: 'system-ui, sans-serif',
          padding: '20px',
          zIndex: 9999,
          textAlign: 'center'
        }}>
          <h1 style={{ margin: '0 0 16px', fontSize: '2rem' }}>Something went wrong</h1>
          <pre style={{
            background: 'rgba(0,0,0,0.5)',
            padding: '16px',
            borderRadius: '8px',
            overflow: 'auto',
            maxHeight: '50vh',
            textAlign: 'left',
            fontSize: '0.85rem'
          }}>
            {this.state.error && this.state.error.toString()}
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '24px',
              padding: '12px 24px',
              background: '#38bdf8',
              color: '#040816',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary