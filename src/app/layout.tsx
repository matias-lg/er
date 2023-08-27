import "./globals.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className="h-full" lang="en">
      <body className="h-full">{children}</body>
    </html>
  );
};

export default RootLayout;
