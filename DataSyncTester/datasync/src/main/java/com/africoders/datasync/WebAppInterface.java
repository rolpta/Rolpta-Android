package com.africoders.datasync;

import android.content.Context;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintJob;
import android.print.PrintManager;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

public class WebAppInterface {
    Context mContext;
    AndroidWebKit wv;

    /** Instantiate the interface and set the context */
    public WebAppInterface(Context c, AndroidWebKit androidWebKit) {
        mContext = c;
        wv=androidWebKit;
    }

    /** Show a toast from the web page */
    @JavascriptInterface
    public void showToast(String toast) {
        Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
    }

    @JavascriptInterface
    public void doPrint() {

        wv.post(new Runnable() {
            @Override
            public void run() {
                createWebPagePrint(wv);
            }
        });

    }



    public  void createWebPagePrint(AndroidWebKit webView) {
		/*if (Build.VERSION.SDK_INT < Build.VERSION_CODES.KITKAT)
            return;*/
        PrintManager printManager = (PrintManager) mContext.getSystemService(Context.PRINT_SERVICE);
        PrintDocumentAdapter printAdapter = webView.createPrintDocumentAdapter();
        String jobName = " Document";
        PrintAttributes.Builder builder = new PrintAttributes.Builder();
        builder.setMediaSize(PrintAttributes.MediaSize.ISO_A5);
        PrintJob printJob = printManager.print(jobName, printAdapter, builder.build());

        if(printJob.isCompleted()){
            Toast.makeText(mContext.getApplicationContext(), "Print Complete", Toast.LENGTH_LONG).show();
        }
        else if(printJob.isFailed()){
            Toast.makeText(mContext.getApplicationContext(), "Print Failed", Toast.LENGTH_LONG).show();
        }
        // Save the job object for later status checking
    }
}
