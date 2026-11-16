import React from 'react';
import { ProceduralSneakerFallback } from './SneakerModel';

interface Props {
  children: React.ReactNode;
  colorHex?: string;
  accentHex?: string;
  wireframe?: boolean;
}

interface State {
  hasError: boolean;
}

export class ModelErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ProceduralSneakerFallback
          colorHex={this.props.colorHex}
          accentHex={this.props.accentHex}
          wireframe={this.props.wireframe}
        />
      );
    }
    return this.props.children;
  }
}
