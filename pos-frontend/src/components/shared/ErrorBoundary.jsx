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
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-[#1f1f1f] px-6 text-center text-[#f5f5f5]">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="max-w-md text-sm text-[#ababab]">
            This screen hit an unexpected error. Your data is safe — reload to try again.
          </p>
          <button
            onClick={this.handleReload}
            className="rounded-lg bg-[#f6b100] px-6 py-3 font-semibold text-[#1f1f1f]"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
