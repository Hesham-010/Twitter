import { enErrorMessage } from './error-messages/messages';
import { arErrorMessage } from './error-messages/messages-ar';
import { i18Errors } from './i18-errors';

export class MessageSource {
  getMessage(errorKey: string, lang?: string, params?) {
    // 1- first way
    // if (!lang) lang = 'en';
    // let localizedMessage: string = i18Errors[lang.toLowerCase()][errorKey];

    // 2- other way
    let localizedMessage: string;
    if ((lang = 'ar')) localizedMessage = arErrorMessage[errorKey];
    else localizedMessage = enErrorMessage[errorKey];

    for (const key in params) {
      localizedMessage = localizedMessage.replace(`{${key}}`, params[key]);
    }

    return localizedMessage;
  }
}
