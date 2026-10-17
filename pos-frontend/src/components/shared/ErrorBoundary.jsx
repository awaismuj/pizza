import React from "react";

// A single unexpected render error anywhere in the tree used to blank the
// entire POS (white screen, nothing recoverable without a manual reload).
// This boundary catches that, shows a recoverable message instead, and logs
// the error so it can be diagnosed.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error("Unhandled UI error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-slate-950 px-6 text-center text-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center text-2xl font-bold shadow-lg">
            ⚠
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Something went wrong</h1>
          <p className="max-w-md text-sm text-slate-400">
            This screen encountered an unexpected display error. All order and server data is safe — click reload to continue.
          </p>
          {this.state.error && (
            <div className="max-w-lg overflow-auto rounded-xl bg-slate-900 border border-slate-800 p-3 text-left font-mono text-xs text-rose-400">
              {this.state.error.message || String(this.state.error)}
            </div>
          )}
          <button
            onClick={this.handleReload}
            className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 font-bold text-sm shadow-md transition"
          >
            Reload POS Terminal
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
