interface UserIdentity {
  id: string;
  email?: string;
  roles: string[];
}

export class AuthService {
  static getProfile(user: UserIdentity) {
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
  }

  static isStudent(user: UserIdentity) {
    return user.roles.includes("STUDENT");
  }

  static isAdmin(user: UserIdentity) {
    return user.roles.includes("ADMIN");
  }
}
