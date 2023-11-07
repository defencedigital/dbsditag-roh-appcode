import { FileValidator } from '@nestjs/common';

export class ValidateFileIsImage extends FileValidator {
  constructor() {
    super({});
  }

  async isValid(file?: Express.Multer.File) {
    if (!file) {
      return false;
    }

    return !!['text/csv'].includes(file.mimetype);
  }
  buildErrorMessage(): string {
    return 'File is not a valid csv file type';
  }
}
