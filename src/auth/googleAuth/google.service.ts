import { Injectable } from "@nestjs/common";

@Injectable()

export class GoogleAuthService {
  googleLogin(req) {
    if (!req.user) return 'No user from google'
    return {
      msg: 'User Google credentials',
      user: req.user
    }
  }
}