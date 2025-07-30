import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Route, Switch } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HomePage } from '@/pages/home';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div className="relative flex min-h-screen flex-col bg-background">
          <Header />
          <main className="flex-1">
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/about">
                <div className="container py-12">
                  <h1 className="text-3xl font-bold">About</h1>
                  <p className="mt-4 text-muted-foreground">
                    This is a clean React application built with modern tools and best practices.
                  </p>
                </div>
              </Route>
              <Route path="/contact">
                <div className="container py-12">
                  <h1 className="text-3xl font-bold">Contact</h1>
                  <p className="mt-4 text-muted-foreground">
                    Get in touch with us for more information.
                  </p>
                </div>
              </Route>
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
        <Toaster />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
