import * as bcrypt from 'bcrypt';

export class PasswordService {
  private readonly saltRounds = 10;

  async hashPassword(plainPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(plainPassword, salt);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
