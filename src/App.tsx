import React, { useState, Suspense } from 'react';
import { Layout } from './components/Layout';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ThemeProvider } from './context/ThemeContext';

<<<<<<< HEAD
=======





>>>>>>> c8f19eb38597ea21acda8a916620381e1b0201c6
// Lazy load components with proper handling of named exports
const TextFormatter = React.lazy(() => 
  import('./components/tools/TextFormatter').then(module => ({ default: module.TextFormatter }))
);
const LoremGenerator = React.lazy(() => 
  import('./components/tools/LoremGenerator').then(module => ({ default: module.LoremGenerator }))
);
const DesignEditor = React.lazy(() => 
  import('./components/tools/DesignEditor').then(module => ({ default: module.DesignEditor }))
);
const ColorTools = React.lazy(() => 
  import('./components/tools/ColorTools').then(module => ({ default: module.ColorTools }))
);
const ImageTools = React.lazy(() => 
  import('./components/tools/ImageTools').then(module => ({ default: module.ImageTools }))
);

function App() {
  const [activeTool, setActiveTool] = useState('text-formatter');
  
  const renderActiveTool = () => {
    const LoadingFallback = () => (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );

    switch (activeTool) {
      case 'text-formatter':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <TextFormatter />
          </Suspense>
        );
      case 'lorem-generator':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <LoremGenerator />
          </Suspense>
        );
      case 'design-editor':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <DesignEditor />
          </Suspense>
        );
      case 'color-tools':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ColorTools />
          </Suspense>
        );
      case 'image-tools':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ImageTools />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingFallback />}>
            <TextFormatter />
          </Suspense>
        );
    }
  };

  return (
    <ThemeProvider>
      <Layout activeTool={activeTool} setActiveTool={setActiveTool}>
        {renderActiveTool()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;