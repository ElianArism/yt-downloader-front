import { Component, Renderer2 } from '@angular/core';
import { DownloaderService } from '../../services/downloader.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-downloader-form',
  templateUrl: './downloader-form.component.html',
  styleUrls: ['./downloader-form.component.scss'],
})
export class DownloaderFormComponent {
  thumbnail!: string;
  title!: string;
  artist!: string;
  spinner: boolean = false;
  errorMsg!: string | null;

  constructor(
    private readonly _r2: Renderer2,
    private readonly _downloaderService: DownloaderService
  ) {}

  /**
   * Control the url passed and check if it is valid.
   * if the url is valid, this method calls getFileUrlToDownload()
   * @param {string} url - The video url
   * @param {string} type - The video ext
   */
  validateUrl(url: string, type: 'video' | 'audio'): void {
    const regex = new RegExp(
      /^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/
    );
    url = url.trim();
    if (!url || !regex.test(url)) {
      this.errorMsg = 'Invalid url.';
      return;
    }
    this.errorMsg = null;
    this.getFileUrlToDownload(url, type);
  }
  /**
   * Handles files dowloads and their options like
   * file information, file download and file information display.
   * @param {string} url
   */
  private getFileUrlToDownload(url: string, type: 'video' | 'audio'): void {
    this._downloaderService.getFileInformation(url).subscribe({
      next: (res: any) => {
        const { thumbnails, title, artist } = res.data?.videoDetails;
        this.showFileInformation({
          thumbnail: thumbnails[thumbnails.length - 1].url,
          title,
          artist,
        });
        this.spinner = true;
        this._downloaderService.prepareFileToDownload(url, type).subscribe({
          next: (res) => {
            this.startFileDownload(res, title);
            this.spinner = false;
          },
          error: (err) => {
            console.log(err);
          },
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  /**
   * Show usefull information of the file.
   * @param {any} showFileInformation - all the file information
   */
  private showFileInformation({ thumbnail, artist, title }: any): void {
    this.thumbnail = thumbnail ?? environment.defaultImage;
    this.artist = artist ?? null;
    this.title = title ?? null;
  }
  /**
   * Download file in the client.
   * @param {any} blob - blob object.
   * @param {string} fileName - file name.
   */
  private startFileDownload(blob: any, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = this._r2.createElement('a');
    this._r2.setAttribute(a, 'href', url);
    this._r2.setAttribute(a, 'download', fileName);
    this._r2.setStyle(a, 'display', 'none');
    a.click();
    document.body.appendChild(a);
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
