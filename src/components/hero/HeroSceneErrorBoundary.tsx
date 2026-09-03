'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// Nothing upstream catches a WebGL/Three.js failure (unsupported device,
// disabled WebGL, a driver rejecting a shader) — without this, that failure
// would propagate past just the hero's 3D art. HeroStageFrame's decorative
// glow/ring and the text overlay render independently of the canvas, so
// falling back to rendering nothing here still leaves a clean, intentional-
// looking section instead of a broken one.
export default class HeroSceneErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Hero 3D scene failed to render', error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
