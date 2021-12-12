import bcryptjs from 'bcryptjs';

export class PasswordService {
  static async hash(password: string): Promise<string> {
    if (!password) {
      return password;
    }
    const salt = await bcryptjs.genSalt();
    const hash = bcryptjs.hash(password, salt);
    return hash;
  }

  static async isValid(password: string, hash: string): Promise<boolean> {
    return await bcryptjs.compare(password, hash);
  }
}