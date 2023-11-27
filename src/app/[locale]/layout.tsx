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
      <head>
        <meta
          name="google-site-verification"
          content="8ukFqWhi9UTFLuP6xhUSFlLbk9TWRlwmd4nNHLz2K7E"
        />
        <meta
          name="description"
          content="Free tool to quickly create ER Diagrams using our markup language.
          Supports multiple notations and advanced ER model features."
        />
      </head>
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
