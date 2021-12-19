import EventBus from '@/ts/utils/EventBus';
import { Topics } from '@/ts/Enums';
import { Toast } from '@/ts/middleware/web-api';

export const success = (detail: string): void => {
  const result = Toast.fromJS({
    detail,
    severity: 'success',
    summary: 'Note',
    life: 4000,
  });

  EventBus.emit(Topics.ToastEvent, result);
};

export const warn = (detail: string): void => {
  const result = Toast.fromJS({
    detail,
    severity: 'warn',
    summary: 'Note',
    life: 4000,
  });

  EventBus.emit(Topics.ToastEvent, result);
};

export const info = (detail: string): void => {
  const result = Toast.fromJS({
    detail,
    severity: 'info',
    summary: 'Note',
    life: 4000,
  });
  EventBus.emit(Topics.ToastEvent, result);
};

export const error = (detail: string): void => {
  const result = Toast.fromJS({
    detail,
    severity: 'error',
    summary: 'Note',
    life: 6000,
  });
  EventBus.emit(Topics.ToastEvent, result);
};
