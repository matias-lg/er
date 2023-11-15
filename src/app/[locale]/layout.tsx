import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import "../globals.css";
import ClientProviders from "./ClientProviders";
import { StrictMode } from "react";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
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
    <html className="m-0 h-full w-full overflow-x-hidden p-0" lang={locale}>
      <title>ERdoc Playground</title>
      <body className="m-0 h-full w-full overflow-x-hidden bg-slate-50 p-0">
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
