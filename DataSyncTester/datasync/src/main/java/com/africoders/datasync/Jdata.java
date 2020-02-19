package com.africoders.datasync;

import android.content.Context;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

import static android.content.Context.MODE_PRIVATE;

public class Jdata {

    public static String base_url;

    public static String TAG = "dataSync";
    public static Context mContext;


    public Jdata(Context _mContext, String _base_url) {
        mContext=_mContext;
        base_url=_base_url;
    }

    //preload local data
    public void preload() {
        String jsonStr = get_asset("cron.json");
        parse_files(jsonStr,false);
    }

    /**
     * Pass in json cron.json log here
     *
     * @param jsonStr
     * @param remote are we parsing local or remote files
     */
    public void parse_files(String jsonStr, boolean remote) {

        try {
            JSONObject jsonObj = new JSONObject(jsonStr);

            // Getting JSON Array node
            JSONArray files = jsonObj.getJSONArray("root");

            base_url = jsonObj.getString("base");

            // looping through All Files
            for (int i = 0; i < files.length(); i++) {
                JSONObject c = files.getJSONObject(i);
                String name = c.getString("name");
                String hash= c.getString("hash");

                process_file(name,hash,remote);
            }
        } catch (final JSONException e) {
            Utils.log("Json parsing error: " + e.getMessage());
        }

    }

    /**
     *
     * @param schema Name of file e.g. rev
     * @param hash The hash of the file
     * @param remote whether local or remote
     */
    private void process_file(String schema, String hash, boolean remote) {

        //local names
        String file1 = schema+".json";
        //String file2 = schema+".js";
        String file3 = schema+".txt";


        if(remote) {
            //process remote file

            //remote URLs
            String file1_remote = base_url+"?get="+schema+".json";
            //String file2_remote = base_url+"?get="+schema+".js";
            String file3_remote = base_url+"?get="+schema+".txt";


            //find hash

            //read hash file if it exists
            String hash_local = file_get_contents(file3);
            String hash_remote = Utils.getFile(file3_remote);



            if (hash_local.equals(hash_remote)) {
                Utils.log(schema+" is up-to-date");
            } else {
                //need updating
                String filedata1=Utils.getFile(file1_remote);
                //String filedata2=Utils.getFile(file2_remote);
                String filedata3=hash_remote;

                if(save_text_file(file1, filedata1)) {
                    Utils.log(schema+" has been updated");
                }
                //save_text_file(file2, filedata2);
                save_text_file(file3, filedata3);
            }

            //Utils.log(file3_local+" [local] "+hash_local);
            //Utils.log(file3_local+" [remote] "+hash_remote);


        } else {
            //local file

            if(Utils.file_exists(file1,mContext)) {
                Utils.log(schema+" is on file");
            } else {
                //store all 3 files
                String filedata1 = get_asset(schema + ".json");
                //String filedata2 = get_asset(schema + ".js");
                String filedata3 = get_asset(schema + ".txt");

                if(save_text_file(file1, filedata1)) {
                    Utils.log(schema+" has been saved");
                }

                //save_text_file(file2, filedata2);
                save_text_file(file3, filedata3);
            }


        }

    }



    private String file_get_contents(String filename) {

        String ret = "";

        try {
            InputStream inputStream = mContext.openFileInput(filename);

            if ( inputStream != null ) {
                InputStreamReader inputStreamReader = new InputStreamReader(inputStream);
                BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
                String receiveString = "";
                StringBuilder stringBuilder = new StringBuilder();

                while ( (receiveString = bufferedReader.readLine()) != null ) {
                    stringBuilder.append(receiveString);
                }

                inputStream.close();
                ret = stringBuilder.toString().trim();
            }
        }
        catch (FileNotFoundException e) {
            Log.e(TAG, "File not found: " + e.toString());
        } catch (IOException e) {
            Log.e(TAG, "Can not read file: " + e.toString());
        } catch (Exception e) {
            Log.e(TAG, "Can not read file: " + e.toString());
        }

        return ret;
    }

    private boolean save_text_file(String filename, String data) {
        if(data==null || data.isEmpty()) {
            Log.e(TAG, "Cannot write empty air to "+filename+"!");
            return false;
        }
        try {
            OutputStreamWriter outputStreamWriter = new OutputStreamWriter(mContext.openFileOutput(filename, MODE_PRIVATE));
            outputStreamWriter.write(data);
            outputStreamWriter.close();

            return true;

            //Log.e(TAG, "File saved: "+filename);
        } catch (java.lang.NullPointerException e) {
            e.printStackTrace();
            Log.e(TAG, "File write failed: "+filename+": " + e.toString());
        }
        catch (IOException e) {
            Log.e(TAG, "File write failed: "+filename+": " + e.toString());
        }
        return false;
    }


    /**
     * This loads files stored in the assets/www/assets/data folder
     *
     * @param schema a file e.g. cron.json
     * @return
     */
    public String get_asset(String schema) {
      return Utils.loadAssetTextAsString(mContext, "www/assets/data/" + schema);
    }
}
