import "./globals.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className="h-full" lang="en">
      <body className="bg-slate-400 h-full">{children}</body>
    </html>
  );
};

export default RootLayout;
