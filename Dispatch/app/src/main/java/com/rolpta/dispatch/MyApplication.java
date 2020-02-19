package com.rolpta.dispatch;

import android.content.Context;

import com.africoders.datasync.DataSync;


public class MyApplication extends android.app.Application {

    //port for running web server
    public static final int PORT = 8352;

    @Override
    public void onCreate() {
        super.onCreate();

        //datasync
    }


    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
    }


}