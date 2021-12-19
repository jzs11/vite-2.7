import { IUserRoles } from './Interfaces';
import { getCookie, deleteCookie } from './helpers/Utils';

interface IGlobalState {
  jwt: string;
  email: string;
  refreshToken: string;
  tokenValidTo: Date;
}

export function getIdentityLocalStorage(): IGlobalState {
  const jsonString = localStorage.getItem('identityLocalStorage') || '';
  if (!jsonString) {
    return {
      jwt: '',
      email: '',
      refreshToken: '',
      tokenValidTo: new Date(),
    };
  }
  return JSON.parse(jsonString) as IGlobalState;
}

export function setIdentityLocalStorage(
  email = '',
  jwt = '',
  refreshToken = '',
  tokenValidTo: Date = new Date(),
): void {
  localStorage.setItem(
    'identityLocalStorage',
    JSON.stringify({
      email,
      jwt,
      refreshToken,
      tokenValidTo,
    }),
  );
}

export function clearIdentityLocalStorage(): void {
  localStorage.removeItem('identityLocalStorage');
  deleteCookie('workbook_site_key');
  window.location.reload();
}

export function getJWT(): string {
  return getIdentityLocalStorage().jwt;
}

export function getRefreshToken(): string {
  return getIdentityLocalStorage().refreshToken;
}

export function getEmail(): string {
  return getIdentityLocalStorage().email;
}

export function getValidTo(): Date {
  return new Date(getIdentityLocalStorage().tokenValidTo) || new Date();
}

export function getUserRoles(): IUserRoles {
  const jwt = getJWT();

  if (jwt) {
    const a = JSON.parse(atob(jwt.split('.')[1]));
    return JSON.parse(a.userrole) as IUserRoles;
  }

  return {
    companyShortName: '',
    companyFullName: '',
    siteRoleDictionary: {
      unknown: -1,
    },
  };
}

export function isCurrentSiteAdmin(): boolean {
  const userRoles = getUserRoles();

  return userRoles.siteRoleDictionary[userRoles.companyShortName] === 0;
}

export function isCurrentWorkbookAdmin(): boolean {
  const userRoles = getUserRoles();
  return userRoles.siteRoleDictionary[getCookie('workbook_site_key')] === 0;
}

export function userDateFormat(): string {
  if (navigator.language === 'en-NZ') {
    return 'dd/mm/yy';
  }
  return 'mm/dd/yy';
}
