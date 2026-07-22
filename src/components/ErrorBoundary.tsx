import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { siteUi } from '@/lib/siteUi';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={`${siteUi.page} py-24 text-center`}>
          <h1 className="text-2xl font-bold text-zinc-900">Что-то пошло не так</h1>
          <p className="mt-4 text-zinc-500">Попробуйте обновить страницу.</p>
          <Button className="mt-8" onClick={() => window.location.reload()}>
            Обновить
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
