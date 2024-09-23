import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";

interface LocaleSwitcherProps {
  className?: string;
}

export default function LocaleSwitcher({ className = "" }: LocaleSwitcherProps) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      className={className}  
      defaultValue={locale}
      items={[
        {
          value: "en",
          label: t("en"),
        },
        {
          value: "kn",
          label: t("kn"),
        },
      ]}
      label={t("label")}
    />
  );
}
