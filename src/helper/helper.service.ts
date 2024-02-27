import * as path from 'path';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as slug from 'speakingurl';
import { generate } from 'voucher-code-generator';
import { Injectable } from '@nestjs/common';
import { Upload } from 'src/_common/uploader/uploader.type';

@Injectable()
export class HelperService {
  public slugify(value: string): string {
    if (value.charAt(value.length - 1) === '-')
      value = value.slice(0, value.length - 1);
    return `${slug(value, { titleCase: true })}-${
      generate({
        charset: '123456789abcdefghgklmnorstuvwxyz',
        length: 4,
      })[0]
    }`.toLowerCase();
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  public updateProvidedFields<T>(model: T, input: object): T {
    Object.keys(input).map((field) => (model[field] = input[field]));
    return model;
  }

  public async getFileName(file: Upload | string) {
    if (typeof file === 'string') return file;

    const { filename } = await file;
    return filename;
  }

  // getDayMinutesFromTimestamp(timestamp: number) {
  //   const startOfDay = new Date(timestamp).setUTCHours(0, 0, 0, 0);
  //   return dateFns.differenceInMinutes(new Date(timestamp), startOfDay);
  // }

  // setTimestampBasedOnDayMinutes(timestamp: number, requiredMinutes: number) {
  //   const startOfDay = new Date(timestamp).setUTCHours(0, 0, 0, 0);
  //   return dateFns.addMinutes(startOfDay, requiredMinutes).getTime();
  // }

  upperCaseFirstLetter(str: string) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
  }

  // public isImage(filePath: string): boolean {
  //   if (!filePath) return false;
  //   return ImageExtensionsAsSet.has(
  //     path.extname(filePath).slice(1).toLowerCase(),
  //   );
  // }

  // public isVideo(filePath: string): boolean {
  //   if (!filePath) return false;
  //   return VideoExtensionsAsSet.has(
  //     path.extname(filePath).slice(1).toLowerCase(),
  //   );
  // }

  public trimAllSpaces(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }
}
