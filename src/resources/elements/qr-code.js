import { customElement, bindable, inlineView } from 'aurelia-framework';
import QRCode from 'qrcode';

@inlineView(`
  <template>
    <div ref="qrCodeElement"></div>
  </template>
`)
@customElement('qr-code')
export class QrCode {

  @bindable data = null;

  async attached() {
    if (this.data) {
      const qrCodeElement = document.createElement('img');

      qrCodeElement.src = await QRCode.toDataURL(this.data);
      
      this.qrCodeElement.appendChild(qrCodeElement);
    }
  }
}
