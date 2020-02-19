package com.africoders.datasync;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Handler;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import com.google.android.material.snackbar.Snackbar;

public class AndroidWebKit extends WebView {

    private static String startUrl="";

    public static int SPLASH_DISPLAY_LENGTH = 5000;

    public static String error404="NETWORK ERROR";
    public static String errorbtn="RELOAD";

    public static Snackbar snackBar;

    public static boolean initialized=false;

    public static AndroidWebKit wv;

    public static MyWebEvents listener=null;

    public AndroidWebKit(Context context) {
        super(context);
        initView(context);
    }

    public AndroidWebKit(Context context, AttributeSet attrs) {
        super(context, attrs);
        initView(context);
    }


    public void setWebEventsListener(MyWebEvents wl) {
        listener = wl;
    }



    public interface MyWebEvents {
        public void onInitialize(WebView view, String url);
        public void onLoad(WebView view, String url);
        public void onError(AndroidWebKit wv, String url);
    }

    /**
     * Check if there is any connectivity
     *
     * @return is Device Connected
     */
    public boolean isConnected() {

        ConnectivityManager cm = (ConnectivityManager)
                this.getContext().getSystemService(Context.CONNECTIVITY_SERVICE);

        if (null != cm) {
            NetworkInfo info = cm.getActiveNetworkInfo();
            return (info != null && info.isConnected());
        }


        return false;

    }

    public void showError(final String url) {
        snackBar = Snackbar.make(wv, error404 , Snackbar.LENGTH_INDEFINITE);
        snackBar.setAction(errorbtn, new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                wv.loadUrl(url);
                //wv.loadUrl("javascript:window.location.reload( true )");
            }
        });
        snackBar.show();

        if (listener != null)
            listener.onError(wv,url); // <---- fire listener here

        wv.setVisibility(GONE);
    }

    //show for the first time
    public void showWebView(final WebView wb, final String url) {

        initialized=true;


        new Handler().postDelayed(new Runnable(){
            @Override
            public void run() {
                wv.setVisibility(View.VISIBLE);

                if (listener != null)
                    listener.onInitialize(wb,url); // <---- fire listener here

            }
        }, SPLASH_DISPLAY_LENGTH);

    }

    @SuppressLint("JavascriptInterface")
    private void initView(Context context){
        wv = this;



        this.setVisibility(GONE);

        // i am not sure with these inflater lines
        LayoutInflater inflater = (LayoutInflater) context
                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        // you should not use a new instance of MyWebView here
        // MyWebView view = (MyWebView) inflater.inflate(R.layout.custom_webview, this);




        this.setPadding(0, 0, 0, 0);

        this.clearHistory();
        this.setInitialScale(1);
        this.getSettings().setLoadWithOverviewMode(true);
        this.getSettings().setUseWideViewPort(true);
        this.setScrollBarStyle(WebView.SCROLLBARS_OUTSIDE_OVERLAY);
        this.getSettings().setJavaScriptEnabled(true);
        this.getSettings().setDomStorageEnabled(true); // This will allow access

        this.getSettings().setSupportMultipleWindows(true);


        this.addJavascriptInterface(new WebAppInterface(this.getContext(),this), "Android");

        this.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onCreateWindow(WebView view, boolean dialog, boolean userGesture, android.os.Message resultMsg)
            {
                WebView.HitTestResult result = view.getHitTestResult();
                String data = result.getExtra();
                Context context = view.getContext();
                Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(data));
                context.startActivity(browserIntent);
                return false;
            }


        });

        this.setWebViewClient(new WebViewClient() {

            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);


            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                String pageTitle = wv.getTitle();
                String[] separated = pageTitle.split(" ");
                if(separated[0].equals("404") || pageTitle.contains("404 Not Found") || pageTitle.contains("You've run out of data")) {
                    showError(url);
                } else if(!initialized) {
                    showWebView(view,url);
                } else {
                    if (listener != null)
                        listener.onLoad(view, url); // <---- fire listener here

                    wv.setVisibility(VISIBLE);
                }

            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                //Utils.log("Error: "+errorCode+" Description:"+description + " Failing url: "+failingUrl);

                showError(failingUrl);

                //Toast.makeText(view.getContext(), "Oh no! " + description,
                //Toast.LENGTH_SHORT).show();
            }

            public boolean shouldOverrideUrlLoading(WebView view, String url) {

                //record starting url here
                if(startUrl.isEmpty()) {startUrl=url;}


                if(!isConnected()) {
                    showError(url);
                    return true;
                } else if (url.startsWith("#")) {
                    return true;
                } else if (url.startsWith("tel:")) {
                    Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse(url));
                    view.getContext().startActivity(intent);
                    return true;
                } else if (url.startsWith("mailto:")) {
                    url = url.substring(7);
                    String body = "Body of message.";
                    Intent mail = new Intent(Intent.ACTION_SEND);
                    mail.setType("application/octet-stream");
                    mail.putExtra(Intent.EXTRA_EMAIL, new String[] { url });
                    mail.putExtra(Intent.EXTRA_SUBJECT, "Subject");
                    mail.putExtra(Intent.EXTRA_TEXT, body);
                    view.getContext().startActivity(mail);
                    return true;
                } else if (url.startsWith("map:")){
                    url = url.substring(4);
                    String map = "http://maps.google.com/maps?q=" + url;
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(map));
                    view.getContext().startActivity(intent);
                    return true;
                }
                return false;
            }
        });

    }


}



