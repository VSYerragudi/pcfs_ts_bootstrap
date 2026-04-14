import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import viteLogo from '@/assets/vite.svg';

export default function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8 p-8">
      <div className="flex items-center gap-8">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="h-24 w-24" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="h-24 w-24 animate-spin" style={{ animationDuration: '20s' }} alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold text-foreground">Vite + React</h1>
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Count is {count}
        </button>
        <p className="text-muted-foreground">
          Edit <code className="rounded bg-muted px-1 py-0.5">src/pages/HomePage.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  );
}
