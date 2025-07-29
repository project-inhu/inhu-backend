import { Controller } from '@nestjs/common';
import { S3UploadService } from '@admin/api/s3-upload/s3-upload.service';

@Controller('s3-upload')
export class S3UploadController {
  constructor(private readonly s3UploadService: S3UploadService) {}
}
