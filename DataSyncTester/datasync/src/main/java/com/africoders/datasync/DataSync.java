package com.africoders.datasync;

import android.content.Context;
import android.os.AsyncTask;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Timer;
import java.util.TimerTask;

public class DataSync {

    public static String datapath="";

    public static String base_url="";

    public static Context context;

    public static Jdata jdata;


    public DataSync(Context context) {
        this.context=context;
    }

    public DataSync init(String path) {
        datapath = path;

        Utils.log("Initializing: " + datapath);

        jdata=new Jdata(context,datapath);

        jdata.preload();

        return this;
    }

    //fire data server
    public void Fire() {
        new LoadData().execute();
    }

    public void Exec() {

            //interval timer service
            Timer t = new Timer();
            t.scheduleAtFixedRate(new TimerTask() {
                @Override
                public void run() {
                    Fire();
                }
            }, 0, 60000 * 15); //15 minutes interval
    }



    private class LoadData extends AsyncTask<Void, Void, Void> {
        @Override
        protected void onPreExecute() {
            super.onPreExecute();
        }

        @Override
        protected Void doInBackground(Void... arg0) {
            HttpHandler sh = new HttpHandler();
            // Making a request to url and getting response
            String jsonStr = sh.makeServiceCall(datapath);

            Utils.log("Preparing to sync: " + datapath);

            //Log.e(TAG, "Response from url: " + jsonStr);

            if (jsonStr != null) {
                jdata.parse_files(jsonStr,true);
            } else {
                Utils.log("Couldn't get json from server.");
            }

            return null;
        }

        @Override
        protected void onPostExecute(Void result) {
            super.onPostExecute(result);
            Utils.log("Datasync completed.\n");
        }
    }
}
