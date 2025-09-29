export class UploadedFileModel {
  url: string;
  name: string;
  ext: string;
  path: string;

  constructor(data: UploadedFileModel) {
    Object.assign(this, data);
  }
}
