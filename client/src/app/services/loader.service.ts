import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loadingRequestCount = 0;
  private spinnerService = inject(NgxSpinnerService);
  
  loading() {
    this.loadingRequestCount++;
    this.spinnerService.show(undefined, {
      type: 'line-scale-party',
      bdColor: 'transparent',
      color: '#999'
    })
  }

  idle() {
    this.loadingRequestCount--;
    if (this.loadingRequestCount <= 0) {
      this.loadingRequestCount = 0;
      this.spinnerService.hide();
    }
  }
  
}
