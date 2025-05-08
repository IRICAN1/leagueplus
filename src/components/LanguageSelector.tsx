
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languageFlags: Record<string, string> = {
  en: "🇬🇧", // UK flag for English
  fr: "🇫🇷", // French flag
  es: "🇪🇸", // Spanish flag
};

export const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language || "en";

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <span className="text-lg mr-1">{languageFlags[currentLanguage]}</span>
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("en")}>
          <span className="text-lg mr-2">{languageFlags.en}</span> {t('language.en')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("fr")}>
          <span className="text-lg mr-2">{languageFlags.fr}</span> {t('language.fr')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("es")}>
          <span className="text-lg mr-2">{languageFlags.es}</span> {t('language.es')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
