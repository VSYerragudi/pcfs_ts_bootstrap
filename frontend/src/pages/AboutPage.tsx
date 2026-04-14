export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold text-foreground">About</h1>
      <div className="space-y-4 text-muted-foreground">
        <p>
          This is a demo full-stack application built with modern web technologies
          as part of the Professional Certificate in Full-Stack Development (PCFS) course.
        </p>
        <h2 className="pt-4 text-xl font-semibold text-foreground">Tech Stack</h2>
        <ul className="list-inside list-disc space-y-2">
          <li>React 19 with TypeScript</li>
          <li>Vite for fast development</li>
          <li>React Router for navigation</li>
          <li>Tailwind CSS v4 for styling</li>
          <li>shadcn/ui for components</li>
          <li>Zustand for state management</li>
        </ul>
      </div>
    </div>
  );
}
