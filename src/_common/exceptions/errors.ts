import { enErrorMessage } from './error-messages/messages';
import { arErrorMessage } from './error-messages/messages-ar';

export class MessageSource {
  getMessage(errorKey: string, lang?: string, params?) {
    let localizedMessage: string;
    if ((lang = 'ar')) localizedMessage = arErrorMessage[errorKey];
    else localizedMessage = enErrorMessage[errorKey];

    for (const key in params) {
      localizedMessage = localizedMessage.replace(`{${key}}`, params[key]);
    }

    return localizedMessage;
  }
}
