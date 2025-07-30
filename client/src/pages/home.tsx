import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Zap, 
  Shield, 
  Smartphone, 
  RefreshCw, 
  CheckCircle,
  ExternalLink 
} from 'lucide-react';

const features = [
  {
    icon: Code,
    title: 'Modern React',
    description: 'Built with React 18, functional components, and hooks',
    badge: 'Latest'
  },
  {
    icon: Zap,
    title: 'Fast Development',
    description: 'Hot reload and instant feedback during development',
    badge: 'Active'
  },
  {
    icon: Shield,
    title: 'Code Quality',
    description: 'ESLint configuration for consistent code standards',
    badge: 'Configured'
  },
  {
    icon: Smartphone,
    title: 'Responsive Design',
    description: 'Tailwind CSS with mobile-first approach',
    badge: 'Ready'
  },
  {
    icon: RefreshCw,
    title: 'Error Boundaries',
    description: 'Graceful error handling and recovery',
    badge: 'Implemented'
  },
  {
    icon: CheckCircle,
    title: 'Production Ready',
    description: 'Optimized build process and deployment ready',
    badge: 'Optimized'
  }
];

export function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 container py-12 md:py-24 lg:py-32">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              Development Server Running
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Welcome to React
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Your development environment is ready. Start building amazing applications with modern React, 
              hooks, and best practices.
            </p>
          </div>
          
          {/* Interactive Demo */}
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Interactive Demo</CardTitle>
              <CardDescription className="text-center">
                Click the button to see React state in action
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="text-2xl font-bold">Count: {count}</div>
              <Button onClick={() => setCount(count + 1)}>
                Click me!
              </Button>
              {count > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCount(0)}
                >
                  Reset
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-12 md:py-24">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              What's Included
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Everything you need to build modern React applications
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <feature.icon className="h-8 w-8 text-primary" />
                    <Badge variant="secondary">{feature.badge}</Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="container py-12 md:py-24 bg-muted/50">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Next Steps
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Ready to start building? Here are some helpful resources
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Start Coding
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Edit <code className="bg-muted px-1 py-0.5 rounded text-sm">src/App.tsx</code> to start building your application.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Add components in <code className="bg-muted px-1 py-0.5 rounded">src/components/</code>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Create pages in <code className="bg-muted px-1 py-0.5 rounded">src/pages/</code>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Use wouter for routing
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Helpful links to get you started quickly
                </p>
                <div className="space-y-2">
                  <a 
                    href="https://react.dev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    React Documentation
                  </a>
                  <a 
                    href="https://tailwindcss.com/docs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Tailwind CSS
                  </a>
                  <a 
                    href="https://ui.shadcn.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Shadcn/ui Components
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
