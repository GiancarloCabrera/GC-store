import {
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  constructor() {}

  private readonly s3_client = new S3Client({
    region: process.env.AWS_S3_REGION,
  });

  async uploadS3(file_name: string, file: Buffer) {
    try {
      const s3 = await this.s3_client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: file_name,
          Body: file,
        }),
      );
      console.log(s3);
      if (s3.$metadata.httpStatusCode === 200) {
        // THIS IS THE URL OF THE FILE --> IMAGE
        const url = `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${file_name}`;
        console.log(url);
        return {
          msg: 'File successfully saved in S3',
          file: { url, ...s3.$metadata },
        };
      } else {
        throw new Error('File could not be saved');
      }
    } catch (error) {
      throw error;
    }
  }

  async getS3(file: string) {
    try {
      // const s3 = await this.s3_client.send(
      //   new GetObjectCommand({
      //     Bucket: process.env.AWS_S3_BUCKET,
      //     Key: file,
      //   })
      // );
      // console.log(s3);
      // THIS IS THE URL OF THE FILE --> IMAGE
      const url = `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${file}`;
      console.log(url);

      // if (s3.$metadata.httpStatusCode === 200) {
      //   return {
      //     msg: 'Found S3 file!',
      //     img: s3.$metadata
      //   }
      // }
      // else {
      //   throw new Error('Product image could not be saved')
      // }
    } catch (error) {
      throw error;
    }
  }

  async deleteS3(file_name: string) {
    try {
      // First check if the file exists

      const existsFile = await this.s3_client.send(
        new HeadObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: file_name,
        }),
      );
      console.log(existsFile);
      if (existsFile.$metadata.httpStatusCode === 200) {
        const deleteFile = await this.s3_client.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: file_name,
          }),
        );

        console.log(deleteFile);
        if (deleteFile.$metadata.httpStatusCode === 204) {
          return {
            msg: 'File successfully deleted from S3 Bucket',
          };
        } else {
          throw new Error('File could not be deleted');
        }
      }
    } catch (error) {
      return error;
    }
  }
}
