package com.e.datasynctester;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.os.Bundle;
import android.webkit.WebView;

import android.media.MediaPlayer;
import android.os.Vibrator;


public class MainActivity extends AppCompatActivity {

    private static WebView wv = null;
    private String URL = "http://staging.afrk.co";



    private Vibrator vib;
    private MediaPlayer mp;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        mp = MediaPlayer.create(this, R.raw.sound);
        vib = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
        vib.vibrate(1500);
        mp.start();

        //mp.stop();
        //vib.cancel();


        //wv = (WebView) findViewById(R.id.webviewMain);

        //wv.loadUrl(URL);



        /*
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                try  {
                    //Your code goes here
                    //db.updateFile("rev");
                    //db.updateFile("facts_30271");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        //thread.start();


        //db.grabFile("rev");


        DataSync dataSync = new DataSync(this);
        dataSync.init("https://mediafactsbook.com/woo/datasync");
        dataSync.Exec();

        */

    }
}
