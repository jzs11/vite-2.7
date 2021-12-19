/* eslint-disable */

import EventBus from '@/ts/utils/EventBus';
import { Topics } from '../Enums';
import { clearIdentityLocalStorage, getJWT } from '../GlobalState';

export class WebApiBase {
  protected transformOptions = async (options: RequestInit): Promise<RequestInit> => {
    EventBus.emit(Topics.AjaxStart);

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${getJWT()}`,
    };
    return Promise.resolve(options);
  };

  protected transformResult = async (
    url: string,
    response: Response,
    processor: (response: Response) => Promise<any>,
  ): Promise<any> => {
    EventBus.emit(Topics.AjaxStop);
    if (response.status === 401) clearIdentityLocalStorage();

    const clonedResponse = response.clone();
    const content = await clonedResponse.text();
    const parsedContent = JSON.parse(content);

    const { toast } = parsedContent;
    if (toast) EventBus.emit(Topics.ToastEvent, toast);

    const { toasts } = parsedContent;
    if (toasts) EventBus.emit(Topics.MultiToastEvent, toasts);

    return processor(response);
  };
}
