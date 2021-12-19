import { Topics } from '@/ts/Enums';
import { clearIdentityLocalStorage, getIdentityLocalStorage, setIdentityLocalStorage } from '@/ts/GlobalState';
import network from '@/ts/middleware/Network';
import {
  CreateUserCommand,
  LoginUserQuery,
  Result,
  UpdatePasswordCommand,
  UpdateUserCommand,
  UserProfileResponse,
} from '@/ts/middleware/web-api';
import EventBus from '@/ts/utils/EventBus';
import { clearRefreshTokenTimer } from './RefreshToken';

class IdentityStore {
  isAuthenticated = (): boolean => !!getIdentityLocalStorage().jwt;

  userDisplayName = async (): Promise<string> => {
    const profile = await network.userProfile();
    if (profile.firstName) return profile.firstName;

    return getIdentityLocalStorage().email;
  };

  getEmail = (): string => getIdentityLocalStorage().email;

  login = (query: LoginUserQuery): Promise<void> =>
    network
      .login(query)
      .then((response) => {
        setIdentityLocalStorage(query.email, response.jtwToken, response.refreshToken, response.validTo);
      })
      .catch();

  logout = (): void => {
    clearRefreshTokenTimer();
    clearIdentityLocalStorage();
    EventBus.emit(Topics.UserLogout);
  };

  registerUser = async (command: CreateUserCommand): Promise<string> => {
    const result = await network
      .register(command)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
    return result;
  };

  updateProfile = (command: UpdateUserCommand): void => {
    network.updateUserProfile(command);
  };

  getUserProfile = (): Promise<UserProfileResponse> => network.userProfile();

  resetPassword = (oldPassword: string, newPassword: string): Promise<Result> => {
    const command = {
      userName: this.getEmail(),
      oldPassword,
      newPassword,
    } as UpdatePasswordCommand;

    return network.password(command);
  };
}

export default IdentityStore;
