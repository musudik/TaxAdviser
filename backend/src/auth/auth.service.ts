import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateOAuthUser(oauthUser: {
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
    accessToken: string;
  }) {
    let user = await this.userRepository.findOne({
      where: { email: oauthUser.email },
    });

    if (!user) {
      user = this.userRepository.create({
        email: oauthUser.email,
        firstName: oauthUser.firstName,
        lastName: oauthUser.lastName,
        role: UserRole.CLIENT,
        isEmailVerified: true,
      });
      await this.userRepository.save(user);
    }

    return this.login(user);
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
  }) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    const { password, ...result } = user;
    return result;
  }

  async enableMfa(userId: string, secret: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }

    user.isMfaEnabled = true;
    user.mfaSecret = secret;
    await this.userRepository.save(user);
    return { success: true };
  }

  async verifyMfa(userId: string, token: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.isMfaEnabled || !user.mfaSecret) {
      throw new UnauthorizedException();
    }

    // Here you would verify the MFA token using a library like speakeasy
    // For now, we'll just return success
    return { success: true };
  }
} 