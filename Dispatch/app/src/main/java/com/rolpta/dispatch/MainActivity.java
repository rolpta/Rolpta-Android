package com.rolpta.dispatch;


import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Vibrator;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.africoders.datasync.AndroidWebServer;
import com.africoders.datasync.GoogleService;
import com.africoders.datasync.Utils;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.GraphRequest;
import com.facebook.GraphResponse;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.karumi.dexter.Dexter;
import com.karumi.dexter.MultiplePermissionsReport;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.multi.MultiplePermissionsListener;
import com.vansuita.pickimage.bean.PickResult;
import com.vansuita.pickimage.bundle.PickSetup;
import com.vansuita.pickimage.dialog.PickImageDialog;
import com.vansuita.pickimage.enums.EPickType;
import com.vansuita.pickimage.listeners.IPickResult;

import org.json.JSONObject;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends AppCompatActivity implements IPickResult {


    public static Vibrator vib;
    public static MediaPlayer mp;

    private Context context;
    public Boolean start_locating=false;

    CallbackManager mCallbackManager;
    List<String> permissionNeeds= Arrays.asList("email");


    private static final int PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION = 1;
    /** Duration of wait for wv**/
    private final int WV_LOAD_LENGTH = 4000;

    /** Duration of wait for gps**/
    private final int GPS_LOAD_LENGTH = 6000;

    public static WebView wv = null;

    private ImageView sp=null;


    private boolean mbErrorOccured = false;
    private boolean mbReloadPressed = false;

    private AndroidWebServer server;

    public static boolean initialize=false;

    public static String URL="";

    public static String TAG = "DataServer";


    @SuppressLint("SetJavaScriptEnabled")

    public static MainActivity Instance;

    public static String LocationText="6.5779976,3.3288193";

    public static String APIURL="http://api.rolpta.afrk.co/";


    public AlertDialog dlg=null;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        FacebookSdk.sdkInitialize(this);
        mCallbackManager = CallbackManager.Factory.create();

        context = this;

        Instance = this;




        sp = (ImageView) findViewById(R.id.splashscreen);
        wv = (WebView) findViewById(R.id.webviewMain);


        wv.setPadding(0, 0, 0, 0);

        wv.setInitialScale(1);
        wv.getSettings().setLoadWithOverviewMode(true);
        wv.getSettings().setUseWideViewPort(true);
        wv.setScrollBarStyle(WebView.SCROLLBARS_OUTSIDE_OVERLAY);
        wv.getSettings().setJavaScriptEnabled(true);
        wv.getSettings().setDomStorageEnabled(true); // This will allow access

        wv.addJavascriptInterface(new WebAppInterface(this), "Android");

        wv.setWebViewClient(new WebViewClient() {

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("mailto:")) {
                    try {
                        Intent emailIntent = new Intent(Intent.ACTION_SEND, Uri.parse(url));
                        emailIntent.setType("message/rfc822");
                        String recipient = url.substring( url.indexOf(":")+1 );
                        if (TextUtils.isEmpty(recipient)) recipient = "loco@wareninja.com";
                        emailIntent.putExtra(Intent.EXTRA_EMAIL, new String[]{recipient});
                        emailIntent.putExtra(Intent.EXTRA_SUBJECT, getString(R.string.email_subject));
                        emailIntent.putExtra(Intent.EXTRA_TEXT, getString(R.string.email_message));

                        startActivity(Intent.createChooser(emailIntent, "Send mail..."));
                    }
                    catch (Exception ex) {}
                    return true;
                } else  if (url.startsWith("tel:")) {
                    Intent intent = new Intent(Intent.ACTION_DIAL,
                            Uri.parse(url));
                    startActivity(intent);
                    return true;
                } else {
                    return super.shouldOverrideUrlLoading(view, url);
                }
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
            }

            @Override
            public void onLoadResource(WebView view, String url) {
                if(url.startsWith("tel:")) {
                    dial_phone(url);
                } else {
                    super.onLoadResource(view, url);
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                if (mbErrorOccured == false && mbReloadPressed) {
                    mbReloadPressed = false;
                }

                //Utils.log("Page finished loading");

                setLocation();


                super.onPageFinished(view, url);
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                mbErrorOccured = true;
                super.onReceivedError(view, errorCode, description, failingUrl);
            }
        });

        wv.setWebChromeClient(getChromeClient());
        wv.clearHistory();


        URL = "file:///android_asset/www/index.html";



        //wv.loadUrl("javascript:window.play_movie_error('network','-1')");


        //kickoff after this is successful
        requestPermissions();



        start_http_server();


    }

    /*Start google tracking*/

    @Override
    protected void onStop() {
        super.onStop();
    }



    private void requestPermissions() {
        Dexter.withActivity(this)
                .withPermissions(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.READ_EXTERNAL_STORAGE,
                        Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.CAMERA, Manifest.permission.CALL_PHONE)
                .withListener(new MultiplePermissionsListener() {

                    @Override
                    public void onPermissionsChecked(MultiplePermissionsReport report) {
                        // check if all permissions are granted
                        if (report.areAllPermissionsGranted()) {

                            //initiate tracker at this point
                            Intent intent = new Intent(getApplicationContext(), GoogleService.class);
                            intent.putExtra("sync", APIURL+"profile/location");
                            startService(intent);

                            //start_http_server();
                        } else {
                            finish();
                        }
                        // check for permanent denial of any permission
                        if (report.isAnyPermissionPermanentlyDenied()) {
                            Utils.log("We don hang o");
                            //finish();
                            // show alert dialog navigating to Settings
                            //showSettingsDialog();
                        }
                    }

                    /**
                     * Method called whenever Android asks the application to inform the user of the need for the
                     * requested permissions. The request process won't continue until the token is properly used
                     *
                     * @param permissions The permissions that has been requested. Collections of values found in
                     *                    {@link Manifest.permission}
                     * @param token       Token used to continue or cancel the permission request process. The permission
                     */
                    @Override
                    public void onPermissionRationaleShouldBeShown(List<PermissionRequest> permissions, PermissionToken token) {
                        token.continuePermissionRequest();
                    }
                })
                .onSameThread()
                .check();
    }





    public void start_http_server() {
        final int PORT = MyApplication.PORT;
        //data server
        server = new AndroidWebServer(PORT, this);
        try {
            server.start();
            Log.w(TAG, "Web server initialized on port "+PORT);


            //load webview at this point, as server is ready
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    //wv.clearCache(true);//Here you call the methond in UI thread
                    wv.loadUrl("http://localhost:"+PORT+"?mode=android");
                }
            });

            //delay a bit before showing webview
            new Handler().postDelayed(new Runnable(){
                @Override
                public void run() {
                    show_webview();
                }
            }, WV_LOAD_LENGTH);


            //delay a bit before enabling
            new Handler().postDelayed(new Runnable(){
                @Override
                public void run() {
                    //start location tracking library
                    try {
                        //start locating
                        start_locating=true;

                        //getLocation();
                    } catch(NullPointerException e) {
                        e.printStackTrace();
                    }
                }
            }, GPS_LOAD_LENGTH);

        } catch(Exception e) {
            e.printStackTrace();
            Log.w(TAG, "The server could not start due to "+e.getMessage());
        }

    }


    //display webview finally
    public void show_webview() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                sp.setVisibility(View.GONE);

            }
        });
    }

    public void dial_phone(String url) {
        Uri number = Uri.parse(url);
        Intent callIntent = new Intent(Intent.ACTION_DIAL, number);
        startActivity(callIntent);
    }

    @Override
    public boolean onSupportNavigateUp() {
        return super.onSupportNavigateUp();
    }


    @Override
    public void onBackPressed() {
        if (wv.canGoBack()) {
            wv.goBack();
            return;
        }
        else {
            finish();
        }

        super.onBackPressed();
    }




    private WebChromeClient getChromeClient() {
        final ProgressDialog progressDialog = new ProgressDialog(MainActivity.this);
        progressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        progressDialog.setCancelable(false);

        return new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
            }
        };
    }

    public class WebAppInterface {
        Context mContext;

        /**
         * Instantiate the interface and set the context
         */
        WebAppInterface(Context c) {
            mContext = c;
        }

        @JavascriptInterface   // must be added for API 17 or higher
        public void send(String data) {
            Log.w(TAG,"bridge:"+data);
            Toast.makeText(mContext, "Send:"+data, Toast.LENGTH_SHORT).show();
        }

        /** Show a toast from the web page */
        @JavascriptInterface
        public void showToast(String toast) {
            Utils.log("Toast: " + toast);
            Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
        }

        @JavascriptInterface
        public void getPhoto(String title) {
            PickImageDialog.build(new PickSetup().setPickTypes(EPickType.GALLERY, EPickType.CAMERA).setTitle(title)).show(MainActivity.this);
        }

        @JavascriptInterface
        public void getCamera(String title) {
            PickImageDialog.build(new PickSetup().setPickTypes(EPickType.CAMERA).setTitle(title)).show(MainActivity.this);
        }

        @JavascriptInterface
        public void facebookLogin() {
            GetFacebookData();
        }


        @JavascriptInterface
        public void dial(String url) {
            Utils.log("Dial "+url);
            dial_phone(url);
        }

        @JavascriptInterface
        public void authorize(String authcode) {
            //set/unset the authorization code
            GoogleService.authorization=authcode;
        }

        @JavascriptInterface
        public void trackgps() {

            runOnUiThread(new Runnable() {
                @Override
                public void run() {

                    wv.loadUrl("javascript:window.gps_location('"+LocationText+"')");

                    wv.loadUrl("javascript:window.applet.acceptGPS('" + LocationText + "')");

                    wv.loadUrl("javascript:window.google_map.acceptGPS('" + LocationText + "')");
                }
            });


        }


        @JavascriptInterface
        public void startNotification() {
            mp = MediaPlayer.create(MainActivity.this, R.raw.sound);
            vib = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            vib.vibrate(15000);
            mp.start();
        }

        @JavascriptInterface
        public void stopNotification() {
            try {
                mp.stop();
                vib.cancel();
            } catch (Exception e) {
                e.printStackTrace();
            }

        }


    }




    @Override
    protected void onDestroy() {
        super.onDestroy();
    }


    private BroadcastReceiver broadcastReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String gps = String.valueOf(intent.getStringExtra("gps"));
            Utils.log("GPS: "+gps);
            setText(gps);
        }
    };


    @Override
    protected void onResume() {
        super.onResume();
        registerReceiver(broadcastReceiver, new IntentFilter(GoogleService.str_receiver));
    }


    @Override
    protected void onPause() {
        super.onPause();
        unregisterReceiver(broadcastReceiver);
    }

    public void setText(String text) {
        LocationText= text;

        setLocation();
    }

    public void setLocation() {
        try {
            wv.loadUrl("javascript:window.gps_location('" + LocationText + "')");
        } catch(Exception e) {
            e.printStackTrace();
        }
    }


    public void saveImage(Bitmap bitmap) {
        if (bitmap != null) {
            String photo = Utils.encodeTobase64(bitmap);
            wv.loadUrl("javascript:window.applet.acceptPhoto('" + photo + "')");
        }
    }

    @Override
    public void onPickResult(PickResult r) {
        if (r.getError() == null) {
            saveImage(r.getBitmap());
        } else {
            //Handle possible errors
            //TODO: do what you have to do with r.getError();
            Toast.makeText(this, r.getError().getMessage(), Toast.LENGTH_LONG).show();
        }
    }


    public void GetFacebookData() {
        LoginManager.getInstance().logInWithReadPermissions(
                this,
                permissionNeeds);
        LoginManager.getInstance().registerCallback(mCallbackManager,
                new FacebookCallback<LoginResult>() {
                    @Override
                    public void onSuccess(LoginResult loginResults) {
                        Log.w(TAG,"Facebook login success");

                        GraphRequest request = GraphRequest.newMeRequest(
                                loginResults.getAccessToken(),
                                new GraphRequest.GraphJSONObjectCallback() {
                                    @Override
                                    public void onCompleted(
                                            JSONObject object,
                                            GraphResponse response) {
                                        // Application code
                                        JSONObject fbdata=response.getJSONObject();
                                        wv.loadUrl("javascript:window.applet.fbresponse('success','"+fbdata.toString()+"')");
                                    }
                                });
                        Bundle parameters = new Bundle();
                        parameters.putString("fields", "id,first_name,last_name,name,email");
                        request.setParameters(parameters);
                        request.executeAsync();

                    }
                    @Override
                    public void onCancel() {

                        Log.w(TAG,"Facebook login cancel");

                        wv.loadUrl("javascript:window.applet.fbresponse('cancel')");
                    }
                    @Override
                    public void onError(FacebookException e) {

                        Log.w(TAG,"Facebook login error because "+e.getMessage());

                        wv.loadUrl("javascript:window.applet.fbresponse('error','"+e.getMessage()+"')");
                    }
                });
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);
        mCallbackManager.onActivityResult(requestCode, resultCode, intent);
    }





}