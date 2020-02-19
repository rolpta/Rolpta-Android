package com.africoders.datasync;


import android.app.AlertDialog;
import android.app.Service;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.Location;
import android.location.LocationManager;
import android.os.Binder;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.provider.Settings;
import android.widget.Toast;


import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;

import java.io.IOException;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Created by deepshikha on 24/11/16.
 */

public class GoogleService extends Service implements LocationListener{
    LocationManager locationManager;

    public AlertDialog dlg=null;

    private Context context;

    public String sync="";

    public static int tracking_status=1;

    private boolean busy = false;
    private double last_lat = 0.0;
    private  double last_lng = 0.0;

    private double fusedLatitude = 0.0;
    private  double fusedLongitude = 0.0;

    // Google client to interact with Google API
    private GoogleApiClient mGoogleApiClient;
    private LocationRequest mLocationRequest;

    public RequestQueue queue;

    public static String str_receiver = "location.receiver";
    Intent intent;


    LocationListener MyListener =null;

    boolean isGPSEnable = false;
    boolean isNetworkEnable = false;

    Location location;
    private Handler mHandler = new Handler();
    private Timer mTimer = null;
    long notify_interval = 1000;

    public static String authorization="";

    public String last_gps="";

    public GoogleService() {

    }

    /**
     * Class for clients to access.  Because we know this service always
     * runs in the same process as its clients, we don't need to deal with
     * IPC.
     */
    public class LocalBinder extends Binder {
        GoogleService getService() {
            return GoogleService.this;
        }
    }

    // This is the object that receives interactions from clients.  See
    // RemoteService for a more complete example.
    private final IBinder mBinder = new LocalBinder();

    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        //Utils.log("Received start id " + startId + ": " + intent);

        sync = intent.getStringExtra("sync");

        return START_NOT_STICKY;
    }


    @Override
    public void onCreate() {
        super.onCreate();

        queue = Volley.newRequestQueue(this);

        context = this;

        startTracking();

        intent = new Intent(str_receiver);

        mTimer = new Timer();
        mTimer.schedule(new TimerTaskToGetLocation(),5000,notify_interval);
    }


    private void startTracking() {
        if(tracking_status==2) {
            Utils.log("Continue Tracking");
            return;
        }

        if (checkLocationOpt() && checkPlayServices()) {
            tracking_status=2;
            Utils.log("Lets track");

            startFusedLocation();
            registerRequestUpdate(this);
        } else {
            Utils.log("Lets fulfill tracking requirements");
        }
    }


    //this works with timer
    private void fn_getlocation(){
        if(MyListener==null) {return;}

        mLocationRequest = LocationRequest.create();
        mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        mLocationRequest.setInterval(5000); // every 5 seconds

        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                try {
                    LocationServices.FusedLocationApi.requestLocationUpdates(mGoogleApiClient, mLocationRequest,MyListener);
                } catch (SecurityException e) {
                    e.printStackTrace();
                } catch (Exception e) {
                    e.printStackTrace();
                    if (!isGoogleApiClientConnected()) {
                        mGoogleApiClient.connect();
                    }
                    registerRequestUpdate(MyListener);
                }
            }
        }, 5000);
    }

    public void registerRequestUpdate(final LocationListener listener) {
        MyListener=listener;

        /*
        mLocationRequest = LocationRequest.create();
        mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        mLocationRequest.setInterval(1000); // every second

        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                try {
                    LocationServices.FusedLocationApi.requestLocationUpdates(mGoogleApiClient, mLocationRequest, listener);
                } catch (SecurityException e) {
                    e.printStackTrace();
                } catch (Exception e) {
                    e.printStackTrace();
                    if (!isGoogleApiClientConnected()) {
                        mGoogleApiClient.connect();
                    }
                    registerRequestUpdate(listener);
                }
            }
        }, 1000);
        */
    }

    public boolean isGoogleApiClientConnected() {
        return mGoogleApiClient != null && mGoogleApiClient.isConnected();
    }


    private Boolean checkLocationOpt() {

        if(dlg != null ) {
            dlg.dismiss();
        }

        LocationManager lm = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        boolean gps_enabled = false;
        boolean network_enabled = false;

        try {
            gps_enabled = lm.isProviderEnabled(LocationManager.GPS_PROVIDER);
        } catch(Exception ex) {}

        try {
            network_enabled = lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
        } catch(Exception ex) {}

        if(!gps_enabled && !network_enabled) {
            // notify user

            AlertDialog.Builder dlgBuilder = new AlertDialog.Builder(context)
                    .setMessage(R.string.gps_network_not_enabled)
                    .setPositiveButton(R.string.open_location_settings, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface paramDialogInterface, int paramInt) {
                            context.startActivity(new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS));
                        }
                    })
                    .setNegativeButton(R.string.Cancel,new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface paramDialogInterface, int paramInt) {
                            Utils.log("Cancelled dlg, try tracking again");
                            startTracking();
                        }
                    });

            dlg = dlgBuilder.create();
            dlg.setCanceledOnTouchOutside(false);
            dlg.show();
            return false;
        }

        return true;
    }


    // check if google play services is installed on the device
    private boolean checkPlayServices() {
        int resultCode = GooglePlayServicesUtil
                .isGooglePlayServicesAvailable(this);
        if (resultCode != ConnectionResult.SUCCESS) {
            if (GooglePlayServicesUtil.isUserRecoverableError(resultCode)) {
                Toast.makeText(getApplicationContext(),
                        "This device is supported. Please download google play services", Toast.LENGTH_LONG)
                        .show();
            } else {
                Toast.makeText(getApplicationContext(),
                        "This device is not supported.", Toast.LENGTH_LONG)
                        .show();
            }
            return false;
        }
        return true;
    }


    @Override
    public void onLocationChanged(Location location) {
        setFusedLatitude(location.getLatitude());
        setFusedLongitude(location.getLongitude());

        double lat = getFusedLatitude();
        double lng = getFusedLongitude();

        if(lat == last_lat && lng==last_lng) {
            Utils.log("Awaiting new location");
        } else {

            String gps = lat + "," + lng;

            //Toast.makeText(getApplicationContext(), "NEW LOCATION RECEIVED: "+gps, Toast.LENGTH_LONG).show();

            Utils.log("Latest New GPS: " + gps + ", Sync to " + sync);

            //broadcast
            intent.putExtra("gps", gps + "");
            sendBroadcast(intent);

            postData(gps, lat, lng);
        }
    }



    public void postData(final String gps, final double lat, final double lng) {
        if(!sync.isEmpty() && !busy && !authorization.isEmpty()) {

            busy=true;

            final String url = sync +"?Authorization="+authorization + "&lat="+lat+"&lng="+lng;

            Utils.log("Attempting to post"+url);

            // Request a string response from the provided URL.
            StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                    new Response.Listener<String>() {
                        @Override
                        public void onResponse(String response) {
                            last_gps=gps;
                            // Display the first 500 characters of the response string.
                            Utils.log("Response is: " + response);

                            //store last values
                            last_lat= lat;
                            last_lng=lng;

                            busy=false;
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Utils.log("Unable to sync data to "+url);

                    busy=false;
                }
            });

            // Add the request to the RequestQueue.
            queue.add(stringRequest);
       }
    }

    public void setFusedLatitude(double lat) {
        fusedLatitude = lat;
    }

    public void setFusedLongitude(double lon) {
        fusedLongitude = lon;
    }

    public double getFusedLatitude() {
        return fusedLatitude;
    }

    public double getFusedLongitude() {
        return fusedLongitude;
    }


    public void startFusedLocation() {
        if (mGoogleApiClient == null) {
            mGoogleApiClient = new GoogleApiClient.Builder(this).addApi(LocationServices.API)
                    .addConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks() {
                        @Override
                        public void onConnectionSuspended(int cause) {
                        }

                        @Override
                        public void onConnected(Bundle connectionHint) {

                        }
                    }).addOnConnectionFailedListener(new GoogleApiClient.OnConnectionFailedListener() {

                        @Override
                        public void onConnectionFailed(ConnectionResult result) {

                        }
                    }).build();
            mGoogleApiClient.connect();
        } else {
            mGoogleApiClient.connect();
        }
    }

    public void stopFusedLocation() {
        if (mGoogleApiClient != null) {
            mGoogleApiClient.disconnect();
        }
    }


    private class TimerTaskToGetLocation extends TimerTask {
        @Override
        public void run() {

            mHandler.post(new Runnable() {
                @Override
                public void run() {
                    fn_getlocation();
                }
            });

        }
    }

}