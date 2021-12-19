import { IConfirmationServiceOption } from '@/ts/Interfaces';
import IdentityStore from '@/ts/stores/IdentityStore';

const icon = 'pi pi-question-circle';
const blockScroll = true;

export const logoutConfirmation: IConfirmationServiceOption = {
  message: 'Are you sure you want to logout?',
  header: 'Confirmation',
  icon,
  blockScroll,
  accept: () => {
    const store = new IdentityStore();
    store.logout();
  },
};

export const getConfirmation = (
  message: string,
  accept: () => void,
  header = 'Confirmation',
): IConfirmationServiceOption => ({
  message,
  header,
  icon,
  blockScroll,
  accept,
});
