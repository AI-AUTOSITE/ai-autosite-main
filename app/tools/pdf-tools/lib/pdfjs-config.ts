// app/tools/pdf-tools/lib/pdfjs-config.ts
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

// Worker設定 - CDNとローカルのフォールバック
if (typeof window !== 'undefined') {
  // まずローカルファイルを試す
  const localWorkerPath = '/pdf.worker.min.js';
  const cdnWorkerPath = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  // ローカルファイルの存在を確認
  fetch(localWorkerPath, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = localWorkerPath;
      } else {
        pdfjsLib.GlobalWorkerOptions.workerSrc = cdnWorkerPath;
      }
    })
    .catch(() => {
      // エラー時はCDNを使用
      pdfjsLib.GlobalWorkerOptions.workerSrc = cdnWorkerPath;
    });
} else {
  // SSR時はCDNを使用
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export { pdfjsLib, PDFDocumentProxy, PDFPageProxy };
export default pdfjsLib;