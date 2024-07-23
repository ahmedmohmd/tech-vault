import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";

@Injectable()
export class RandomTokenService {
  generateRandomToken(length: number): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString("hex")
      .slice(0, length);
  }
}
