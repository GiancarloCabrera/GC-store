import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

// Perosnalizaed class validator for uploading files to S3
@ValidatorConstraint({ name: 'fileUpload', async: false })
export class FileUploadValidator implements ValidatorConstraintInterface {
  validate(buffer: Buffer, args: ValidationArguments): boolean | Promise<boolean> {
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    // If it is false, it will return the error below
    return buffer.length <= maxSize
  }
  defaultMessage(args: ValidationArguments): string {
    return 'File size exceeds the allowed limit.';
  }
}