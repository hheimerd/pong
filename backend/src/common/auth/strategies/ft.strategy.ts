import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42"
import { UserService } from "src/user/user.service";
import { ftConstants } from "../auth.constants";
import bcryptjs from 'bcryptjs';
const { genSalt } = bcryptjs;
import { IFtProfile } from "../interfaces/ft-profile.interface";

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      clientID: ftConstants.FORTYTWO_APP_ID,
      clientSecret: ftConstants.FORTYTWO_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/login42"
    })
  }

  async validate(accessToken, refreshToken, profile: IFtProfile, cb) {
    console.log(profile);
    
    const dto = {
      email: profile.emails[0].value,
      login: profile.username,
      name: profile.name.familyName + ' ' + profile.name.familyName,
      password: await genSalt()
    }
    console.log(dto);
    
    return this.userService.findOrCreate(dto);
  }
}
