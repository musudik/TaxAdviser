import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = await this.userRepository.findOne({
      where: { email: emails[0].value },
    });

    if (!user) {
      const newUser = this.userRepository.create({
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        googleId: profile.id,
        isEmailVerified: true,
      });
      await this.userRepository.save(newUser);
      return done(null, newUser);
    }

    if (!user.googleId) {
      user.googleId = profile.id;
      await this.userRepository.save(user);
    }

    return done(null, user);
  }
} 