import "dayjs/locale/bg";
import "dayjs/locale/da";
import "dayjs/locale/nl";
import "dayjs/locale/fi";
import "dayjs/locale/fr";
import "dayjs/locale/fr-ch";
import "dayjs/locale/ja";
import "dayjs/locale/de";
import "dayjs/locale/en";
import "dayjs/locale/en-gb";
import "dayjs/locale/el";
import "dayjs/locale/es";
import "dayjs/locale/hr";
import "dayjs/locale/hu";
import "dayjs/locale/it";
import "dayjs/locale/lt";
import "dayjs/locale/lv";
import "dayjs/locale/mk";
import "dayjs/locale/nb";
import "dayjs/locale/pl";
import "dayjs/locale/pt";
import "dayjs/locale/ro";
import "dayjs/locale/ru";
import "dayjs/locale/sr";
import "dayjs/locale/sk";
import "dayjs/locale/sl";
import "dayjs/locale/sv";
import "dayjs/locale/tr";
import "dayjs/locale/it";
import "dayjs/locale/zh-cn";
import "dayjs/locale/zh-tw";
import "dayjs/locale/zh-hk";

import { PickerLocale } from "antd/lib/date-picker/generatePicker";
import bg_BG from "antd/lib/date-picker/locale/bg_BG";
import da_DK from "antd/lib/date-picker/locale/da_DK";
import nl_NL from "antd/lib/date-picker/locale/nl_NL";
import nl_BE from "antd/lib/date-picker/locale/nl_BE";
import fi_FI from "antd/lib/date-picker/locale/fi_FI";
import fr_FR from "antd/lib/date-picker/locale/fr_FR";
import fr_BE from "antd/lib/date-picker/locale/fr_BE";
import ja_JP from "antd/lib/date-picker/locale/ja_JP";
import de_DE from "antd/lib/date-picker/locale/de_DE";
import el_GR from "antd/lib/date-picker/locale/el_GR";
import es_ES from "antd/lib/date-picker/locale/es_ES";
import en_US from "antd/lib/date-picker/locale/en_US";
import en_GB from "antd/lib/date-picker/locale/en_GB";
import hr_HR from "antd/lib/date-picker/locale/hr_HR";
import hu_HU from "antd/lib/date-picker/locale/hu_HU";
import it_IT from "antd/lib/date-picker/locale/it_IT";
import lt_LT from "antd/lib/date-picker/locale/lt_LT";
import lv_LV from "antd/lib/date-picker/locale/lv_LV";
import mk_MK from "antd/lib/date-picker/locale/mk_MK";
import nb_NO from "antd/lib/date-picker/locale/nb_NO";
import pl_PL from "antd/lib/date-picker/locale/pl_PL";
import pt_PT from "antd/lib/date-picker/locale/pt_PT";
import ro_RO from "antd/lib/date-picker/locale/ro_RO";
import ru_RU from "antd/lib/date-picker/locale/ru_RU";
import sr_RS from "antd/lib/date-picker/locale/sr_RS";
import sk_SK from "antd/lib/date-picker/locale/sk_SK";
import sl_SI from "antd/lib/date-picker/locale/sl_SI";
import tr_TR from "antd/lib/date-picker/locale/tr_TR";
import sv_SE from "antd/lib/date-picker/locale/sv_SE";
import zh_CN from "antd/lib/date-picker/locale/zh_CN";
import zh_TW from "antd/lib/date-picker/locale/zh_TW";

// TODO.. this need improvement.. not catering en-IN and so on..
// we are supporting langauge without country based, hence we can use only country concept here.
const DatePickerLocaleMap = new Map<string, PickerLocale>([
  ["bg-BG", bg_BG],
  ["da", da_DK],
  ["nl", nl_NL],
  ["nl-BE", nl_BE],
  ["fi", fi_FI],
  ["fr", fr_FR],
  ["fr-BE", fr_BE],
  ["fr-CH", fr_FR],
  ["ja", ja_JP],
  ["de", de_DE],
  ["de-DE", de_DE],
  ["de-CH", de_DE],
  ["en", en_US],
  ["en-US", en_US],
  ["en-GB", en_GB],
  ["el", el_GR],
  ["es", es_ES],
  ["hr", hr_HR],
  ["hu", hu_HU],
  ["it", it_IT],
  ["it-CH", it_IT],
  ["lt", lt_LT],
  ["lv", lv_LV],
  ["mk", mk_MK],
  ["no", nb_NO],
  ["pl", pl_PL],
  ["pt", pt_PT],
  ["ro", ro_RO],
  ["ro-MO", ro_RO],
  ["ru", ru_RU],
  ["ru-MI", ru_RU],
  ["sr", sr_RS],
  ["sk", sk_SK],
  ["sl", sl_SI],
  ["sv", sv_SE],
  ["sv-FI", fi_FI],
  ["tr", tr_TR],
  ["zh", zh_CN],
  ["zh-TW", zh_TW],
  ["zh-CN", zh_CN],
  ["zh-HK", zh_CN],
  ["zh-SG", zh_CN],
]);

export function getDatePickerLocale(locale: string): PickerLocale {
  return DatePickerLocaleMap.get(locale) || en_US;
}

// test data:
const browserLanguages = [
  "af",
  "sq",
  "ar-SA",
  "ar-IQ",
  "ar-EG",
  "ar-LY",
  "ar-DZ",
  "ar-MA",
  "ar-TN",
  "ar-OM",
  "ar-YE",
  "ar-SY",
  "ar-JO",
  "ar-LB",
  "ar-KW",
  "ar-AE",
  "ar-BH",
  "ar-QA",
  "eu",
  "bg",
  "be",
  "ca",
  "zh-TW",
  "zh-CN",
  "zh-HK",
  "zh-SG",
  "hr",
  "cs",
  "da",
  "nl",
  "nl-BE",
  "en",
  "en-US",
  "en-EG",
  "en-AU",
  "en-GB",
  "en-CA",
  "en-NZ",
  "en-IE",
  "en-ZA",
  "en-JM",
  "en-BZ",
  "en-TT",
  "et",
  "fo",
  "fa",
  "fi",
  "fr",
  "fr-BE",
  "fr-CA",
  "fr-CH",
  "fr-LU",
  "gd",
  "gd-IE",
  "de",
  "de-CH",
  "de-AT",
  "de-LU",
  "de-LI",
  "el",
  "he",
  "hi",
  "hu",
  "is",
  "id",
  "it",
  "it-CH",
  "ja",
  "ko",
  "lv",
  "lt",
  "mk",
  "mt",
  "no",
  "pl",
  "pt-BR",
  "pt",
  "rm",
  "ro",
  "ro-MO",
  "ru",
  "ru-MI",
  "sz",
  "sr",
  "sk",
  "sl",
  "sb",
  "es",
  "es-AR",
  "es-GT",
  "es-CR",
  "es-PA",
  "es-DO",
  "es-MX",
  "es-VE",
  "es-CO",
  "es-PE",
  "es-EC",
  "es-CL",
  "es-UY",
  "es-PY",
  "es-BO",
  "es-SV",
  "es-HN",
  "es-NI",
  "es-PR",
  "sx",
  "sv",
  "sv-FI",
  "th",
  "ts",
  "tn",
  "tr",
  "uk",
  "ur",
  "ve",
  "vi",
  "xh",
  "ji",
  "zu",
];
