export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background py-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/ceralume_logo.png"
            alt="Ceralume Labs"
            className="h-8 w-auto opacity-70"
          />
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} Ceralumelabs India (OPC) Private Limited. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
