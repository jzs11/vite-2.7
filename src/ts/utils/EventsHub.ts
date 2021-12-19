import router from '@/ts/router/index';
import EventBus from '@/ts/utils/EventBus';
import { Topics } from '@/ts/Enums';
import { Toast } from '@/ts/middleware/web-api';
import { IPToast } from '@/ts/Interfaces';
import Paths from '@/ts/router/map';

const startWatch = (toast: IPToast): void => {
  EventBus.on(Topics.GoToUserSettings, () => {
    router.push(Paths.UserSettings);
  });

  EventBus.on(Topics.ToastEvent, (payload: unknown) => {
    const content = payload as Toast;
    if (content.detail) toast.add(payload as Toast);
  });

  EventBus.on(Topics.MultiToastEvent, (messages: unknown) => {
    (messages as Array<Toast>).filter((p) => !!p.detail).forEach((message) => toast.add(message));
  });

  EventBus.on(Topics.GoTo404Page, () => {
    router.push('/404');
  });
};

export default startWatch;
