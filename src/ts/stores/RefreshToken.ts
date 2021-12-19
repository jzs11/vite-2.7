import { getEmail, getRefreshToken, setIdentityLocalStorage } from '@/ts/GlobalState';
import network from '@/ts/middleware/Network';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let refreshTokenTimerId: any = null;

export function setRefreshTokenTimer(): void {
  if (refreshTokenTimerId !== null) return;
  refreshTokenTimerId = setInterval(() => {
    const email = getEmail();
    network.refreshToken(getRefreshToken(), email).then((p) => {
      setIdentityLocalStorage(email, p.jtwToken, p.refreshToken, p.validTo);
    });
  }, 1000 * 60 * 60 * 3);
}

export function clearRefreshTokenTimer(): void {
  if (refreshTokenTimerId) clearInterval(refreshTokenTimerId);
}
