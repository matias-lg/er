import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { useTransition } from "react";
import { MdLanguage } from "react-icons/md";
import { Dropdown } from "./Dropdown";

const LocaleSwitcher = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("home.header.localeSwitcher");

  const onLocaleChange = (nextLocale: string) => {
    if (isPending) return;
    startTransition(() => {
      router.push(pathname, { locale: nextLocale });
    });
  };

  return (
    <Dropdown
      title={
        <div className="flex items-center">
          <MdLanguage size={25} /> <span className="pl-2">{t("label")}</span>
        </div>
      }
      items={["en", "es"].map((locale) => [
        t(locale),
        () => onLocaleChange(locale),
      ])}
    />
  );
};

export default LocaleSwitcher;
