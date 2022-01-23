import { html } from "htm/react";
import React, { ErrorInfo, ReactNode } from "react";
import ProposalInput from "../../components/proposalInput/ProposalInput";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}


class ErrorBoundary extends React.Component<Props, State> {
    public state: State = {
        hasError: false
    };
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public static getDerivedStateFromError(error: Error) {  
        return { hasError: true };
    }
    public render() {
        if (this.state.hasError) {
            return html`<h1>Sorry.. there was an error</h1>`
        }

        return this.props.children;
    }
}
export default ErrorBoundary