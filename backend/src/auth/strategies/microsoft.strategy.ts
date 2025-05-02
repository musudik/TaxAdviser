import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-microsoft";
import { AuthService } from "../auth.service";

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, "microsoft") {
  constructor(private authService: AuthService) {
    const clientID = process.env.MICROSOFT_CLIENT_ID;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
    const callbackURL = process.env.MICROSOFT_CALLBACK_URL;

    // Prepare the configuration object based on the presence of environment variables
    const config =
      clientID && clientSecret && callbackURL
        ? {
            clientID,
            clientSecret,
            callbackURL,
            scope: ["user.read"],
          }
        : {
            clientID: "dummy-id",
            clientSecret: "dummy-secret",
            callbackURL: "http://localhost/auth/microsoft/callback",
            scope: ["user.read"],
          };

    // Call super with the configuration object
    super(config);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    return this.authService.validateOAuthUser(user);
  }
}
