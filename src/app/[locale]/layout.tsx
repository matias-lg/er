import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import "../globals.css";
import ClientProviders from "./ClientProviders";
import { StrictMode } from "react";

// TODO: When the translations are ready, add the 'es' locale here
export function generateStaticParams() {
  return [{ locale: "en" }];
}

const RootLayout = async ({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) => {
  let messages: AbstractIntlMessages;
  try {
    messages = (await import(`../../locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html className="h-full" lang={locale}>
      <title>ERdoc Playground</title>
      <body className="h-full bg-slate-50">
        <StrictMode>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ClientProviders>{children}</ClientProviders>
          </NextIntlClientProvider>
        </StrictMode>
      </body>
    </html>
  );
};

export default RootLayout;
