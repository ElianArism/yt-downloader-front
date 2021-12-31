import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { IFileOptions } from 'src/interfaces/file-options.interface';

@Injectable({
  providedIn: 'root',
})
export class DownloaderService {
  private readonly _url: string = 'http://localhost:3000';
  constructor(private readonly _http: HttpClient) {}

  /**
   * Get all the information of a file by url.
   * @param {string} url - url of the file.
   * @returns {Observable} obs
   */
  downloadVideo(url: string): Observable<any> {
    return this._http.post(`${this._url}/download-video`, { url });
  }
  /**
   * Get all the information of a file by url.
   * @param {string} url - url of the file.
   * @returns {Observable} obs
   */
  getFileInformation(url: string): Observable<any> {
    return this._http.post(`${this._url}/file-information`, {
      url,
    });
  }
  /**
   * Download a file by url and calls the function to return it.
   * @param {string} url - url of the file.
   * @returns {Observable} obs
   */
  prepareFileToDownload(url: string, type: 'audio' | 'video'): Observable<any> {
    const endpointUrl =
      type === 'audio' ? `${this._url}/take-audio` : `${this._url}/take-video`;
    return this._http
      .post(endpointUrl, {
        url,
      })
      .pipe(
        switchMap((res: any) => {
          return this.getFileToDownload(<IFileOptions>res.data);
        })
      );
  }
  /**
   * Return the file to download it.
   * @param {string} fileName - name of the file.
   * @returns {Observable} obs
   */
  private getFileToDownload(fileOptions: IFileOptions): Observable<any> {
    return this._http.get(`${this._url}/download`, {
      headers: { file_opts: JSON.stringify(fileOptions) },
      responseType: 'blob',
    });
  }
}
