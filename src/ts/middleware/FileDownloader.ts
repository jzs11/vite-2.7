import { getJWT } from '../GlobalState';
import { EventEmitter } from '../utils/EventsEmitter';
import { FileItem } from './web-api';

class FileDownloader extends EventEmitter {
  constructor(public file: FileItem) {
    super();
  }

  download = () => {
    const fileId = this.file.id || '';
    const fileName = this.file.name || '';
    const extension = this.file.extension || '';
    const contentType = this.file.contentType || '';

    const request = this.getRequest('download', fileId, fileName, extension, contentType);

    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        const anchor = document.createElement('a');
        anchor.href = window.URL.createObjectURL(request.response);
        anchor.download = `${fileName}.${extension}`;

        document.body.appendChild(anchor);
        anchor.click();

        this.fire('finish');
        anchor.remove();
      }
    };

    this.percentageChanges(request);
  };

  preview = () => {
    const fileId = this.file.id || '';
    const fileName = this.file.name || '';
    const extension = this.file.extension || '';
    const contentType = this.file.contentType || '';

    const request = this.getRequest('preview', fileId, fileName, extension, contentType);

    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        const anchor = document.createElement('a');
        anchor.href = window.URL.createObjectURL(request.response);
        anchor.target = '_blank';

        document.body.appendChild(anchor);
        anchor.click();

        this.fire('finish');
        anchor.remove();
      }
    };

    this.percentageChanges(request);
  };

  private percentageChanges(request: XMLHttpRequest) {
    request.onprogress = (e) => {
      const percentComplete = Math.floor((e.loaded / e.total) * 100);

      this.fire('percentage', percentComplete);
    };
  }

  private getRequest(action: string, fileId: string, fileName: string, extension: string, contentType: string) {
    const request = new XMLHttpRequest();
    request.responseType = 'blob';
    const url = `/api/storage/${action}?fileId=${encodeURIComponent(fileId)}&fileName=${encodeURIComponent(
      fileName,
    )}&extension=${encodeURIComponent(extension)}&contentType=${encodeURIComponent(contentType)}`;

    request.open('get', url, true);
    request.setRequestHeader('Authorization', `Bearer ${getJWT()}`);
    request.send();
    this.fire('start');
    return request;
  }
}

export default FileDownloader;
