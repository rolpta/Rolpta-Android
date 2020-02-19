package com.africoders.datasync;

import android.content.Context;
import android.os.StrictMode;
import android.util.Log;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import fi.iki.elonen.NanoHTTPD;


public class AndroidWebServer extends NanoHTTPD {

    public String TAG = "Httpd";
    public Context mContext;



    public AndroidWebServer(int port, Context context) {
        super(port);
        mContext=context;
        Initialize();
    }

    private void Initialize() {
        if (android.os.Build.VERSION.SDK_INT > 9) {
            StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
            StrictMode.setThreadPolicy(policy);
        }

    }

    public AndroidWebServer(String hostname, int port, Context context) {
        super(hostname, port);
        mContext=context;
        Initialize();
    }

    @Override
    public Response serve(IHTTPSession session) {
        Method method = session.getMethod();
        String uri = session.getUri();
        //Log.w(TAG, method + " '" + uri + "' ");

        InputStream mbuffer = null;

        String mime_type = NanoHTTPD.MIME_HTML;



        String path;
        if(uri.equals("/")){
            path="/index.html";
        }else{
                path=uri;
        }

        mime_type=getMimeType(path);


        if(path.contains("assets/data")) {
            //api request
            String subpath=path.replace("/assets/data/","");
            //Log.w(TAG,"xpath "+subpath);

            try {
                mbuffer = mContext.openFileInput(subpath);
            }
            catch (FileNotFoundException e) {
                mbuffer=null;
                e.printStackTrace();
                Log.e(TAG,subpath+" was not found");
                return null;
            } catch (Exception e) {
                mbuffer=null;
                e.printStackTrace();
                Log.e(TAG,subpath+" was not found");
                return null;
            }
        } else {
            //regular requests

            try {
                mbuffer = mContext.getAssets().open("www" + path);
            } catch (FileNotFoundException e) {
                mbuffer = null;
                e.printStackTrace();
                Log.e(TAG, path + " was not found");
                return null;
            } catch (IOException e) {
                mbuffer = null;
                e.printStackTrace();
                Log.e(TAG, path + " was not found");
                return null;
            }
        }

        //String source=loadAssetTextAsString(mContext,"www"+path);
        //if(source==null) {source=path+" was not found";}

        //Log.e(TAG,path+"::"+mime_type);
        //Log.e(TAG,source);


        return newChunkedResponse(Response.Status.OK,mime_type,mbuffer);

        //return newFixedLengthResponse(Response.Status.OK,mime_type,source);

        //return newFixedLengthResponse(source);
    }


    public String getMimeType(String filename)
    {
        String filenameArray[] = filename.split("\\.");
        String extension = filenameArray[filenameArray.length-1];


        String mimeType = MimeTypeUtil.getType(extension);

        return mimeType;
    }



}