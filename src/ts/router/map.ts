enum RoutePath {
  Users = '/users',
  UserLogin = '/users/sign-in',
  SignIn = 'sign-in',
  UserSettings = '/users/settings',
  UserNew = '/users/sign-up',
  SignUp = 'sign-up',
  WorkbooksNew = '/new',
  New = 'new',
  Help = '/help',
  CatchAll = '/:catchAll(.*)',
}

export default RoutePath;
