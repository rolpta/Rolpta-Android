package com.africoders.datasync;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.ConnectivityManager;
import android.net.Uri;
import android.os.Build;
import android.os.SystemClock;
import android.provider.MediaStore;
import android.telephony.TelephonyManager;
import android.text.format.DateFormat;
import android.text.format.Time;
import android.util.Base64;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Timer;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;


/**
 * Created by Dr. Anthony Ogundipe on 5/25/2015.
 */
public class Utils {


    public static String error_log;

    public static Context ctx;
    public static Context context;
    public static Timer timer=null;
    public static String base_url=null;

    public static String TAG="DataSync";

    public static Utils Instance;



    public static Utils init(Context context) {
        return new Utils(context);
    }

    public Utils(Context context) {
        Instance=this;
        this.ctx=context;
        this.context=context;
    }

    public static long now() {
        Time time = new Time();   time.setToNow();
        return time.toMillis(false);
    }

    public static String time() {
        Time time = new Time();   time.setToNow();
        String ctime= Long.toString(time.toMillis(false));
        return ctime;
    }

    public static String getTimeStamp() {return time();}

    public static void  setBaseUrl(String url) {
        base_url=url;
    }

    public static String base_url() {
        return base_url;
    }

    public static String base_url(String url) {
        if(url.startsWith("http")) {return url;}
        return base_url+url;
    }

    public static String encodeTobase64(Bitmap image)
    {
        Bitmap immagex=image;
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        immagex.compress(Bitmap.CompressFormat.PNG, 100, baos);
        byte[] b = baos.toByteArray();
        String imageEncoded = Base64.encodeToString(b, Base64.DEFAULT);
        return imageEncoded;
    }

    public static Bitmap decodeBase64(String input)
    {
        byte[] decodedByte = Base64.decode(input, 0);
        return BitmapFactory.decodeByteArray(decodedByte, 0, decodedByte.length);
    }

    public static String getTime(int time, Integer... ctype) {
        long millisecond = Long.parseLong(String.valueOf(time));
        return getTime(millisecond,ctype);
    }

    public static String getTime(String time, Integer... ctype) {
        long millisecond = Long.parseLong(time);
        return getTime(millisecond,ctype);
    }

    public static String getTime2(String time) {
        long millisecond = Long.parseLong(time);
        String dateString = DateFormat.format("hh:mm aaa", new Date(millisecond)).toString();
        return dateString;
    }

    public static String getLong2Date(String time) {
        long millisecond = Long.parseLong(time);
        String dateString = DateFormat.format("dd-MMM-yyyy", new Date(millisecond)).toString();
        return dateString;
    }

    public static String getLong2DateTime(String time) {
        long milliSeconds = Long.parseLong(time);

       //SimpleDateFormat formatter = new SimpleDateFormat("dd-MMM-yyyy HH:mm", Locale.ENGLISH);
        SimpleDateFormat formatter = new SimpleDateFormat("dd-MMM-yyyy HH:mm", Locale.ENGLISH);

        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(milliSeconds);

        String datetime = formatter.format(calendar.getTime());


        //String dateString = DateFormat.format("dd-MMM-yyyy HH:mm:ss", new Date(milliSeconds)).toString();
        return datetime;
    }


    public static int countMatches(String str, String sub) {
        int count=0;

        try {
            count = str.length() - str.replace(sub, "").length();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return count;
    }


    public static long DateReformat(String date_string, String format) {
        Date date=null;
        long timeInMillis=0;

        try {
            date = new SimpleDateFormat(format, Locale.ENGLISH).parse(date_string);
            timeInMillis = date.getTime();
        } catch (ParseException e) {
            Utils.log("Failed to parse time because "+e.getMessage());
            e.printStackTrace();
        } catch (NullPointerException e) {
            Utils.log("Failed to parse time because "+e.getMessage());
            e.printStackTrace();
        }




        return timeInMillis;
    }

    //formats date from 10-Jun-2015 15:01  to long
    public static long DateReformat(String s) {
        Date date=null;

        int count= countMatches(s, ":");

        try {
            if(count==1) {
                date = new SimpleDateFormat("dd-MMM-yyyy HH:mm", Locale.ENGLISH).parse(s);
            } else {
                date = new SimpleDateFormat("dd-MMM-yyyy HH:mm:ss", Locale.ENGLISH).parse(s);
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }

        long timeInMillis = date.getTime();
        //Calendar calendar = Calendar.getInstance();
        //calendar.setTimeInMillis (timeInMillis);

        return timeInMillis;
    }

    //date like 10-Jun-2015 15:01 - returns the total number of weeks
    public static int DateDifference(String sdate1, String sdate2) {
        long currentTime = DateReformat(sdate1);
        long futureTime = DateReformat(sdate2);

        int res=(int) (futureTime - currentTime)/(24*60*60*1000);
        if(res<0) {res*=-1;}
        return res;
    }

    //format "MM/dd/yyyy hh:mm aaa"
    public static String long2time(long millisecond, String format) {
        String dateString="";

        dateString = DateFormat.format(format, new Date(millisecond)).toString();

        return dateString;
    }

    public static String getTime(long millisecond, Integer... ctype) {
        String dateString="";

        String result = DateFormat.format("MM/dd/yyyy", new Date(millisecond)).toString();

        if(formatRelTime(result, 0)) {
            //it is today, so just give me the time stamp directly
            dateString = DateFormat.format("hh:mm aaa", new Date(millisecond)).toString();
        } else {
            //provide me with date and time stamp as well
            dateString = DateFormat.format("MM/dd/yyyy hh:mm aaa", new Date(millisecond)).toString();
        }

        return dateString;
    }

    public static boolean formatRelTime(String result, int days) {
        Calendar cal= Calendar.getInstance();
        cal.add(Calendar.DATE, 0-days);
        long millisecond = cal.getTime().getTime();
        String r= DateFormat.format("MM/dd/yyyy", new Date(millisecond)).toString();
        if(r.matches(result)) {return true;} else {return false;}
    }

    //get relative time
    public static String getRelTime(String time) {
        long millisecond = Long.parseLong(time);

        //get the actual date
        String result = DateFormat.format("MM/dd/yyyy", new Date(millisecond)).toString();

        // get Calendar with current date
        Calendar cal= Calendar.getInstance();

        //get today
        boolean days0 =formatRelTime(result,0);
        boolean days1 =formatRelTime(result,1);
        boolean days2 =formatRelTime(result,2);
        boolean days3 =formatRelTime(result,3);
        boolean days4 =formatRelTime(result,4);
        boolean days5 =formatRelTime(result,5);
        boolean days6 =formatRelTime(result,6);
        boolean days7 =formatRelTime(result,7);
        //boolean days8 =formatRelTime(result,-8);
        //boolean days9 =formatRelTime(result,-9);
        //boolean days10 =formatRelTime(result,-10);
        //boolean days11 =formatRelTime(result,-11);

        if(days0) {result="Today";}
        else if(days1) {result="Yesterday";}
        else if(days2) {result="2 days ago";}
        else if(days3) {result="3 days ago";}
        else if(days4) {result="4 days ago";}
        else if(days5) {result="5 days ago";}
        else if(days6) {result="6 days ago";}
        else if(days7) {result="a week ago";}


        return result;
    }

    public static long date_yesterday() {
        // get Calendar with current date
        Calendar cal = Calendar.getInstance();

// get yesterday's date
        cal.add(Calendar.DATE, -1); // get yesterday's date in milliseconds
        long lMillis = cal.getTime().getTime();
        return lMillis;
    }

    public static String padRight(String s, int n) {
        return String.format("%1$-" + n + "s", s);
    }

    public static String padLeft(String s, int n) {
        return String.format("%1$" + n + "s", s);
    }


    //string like January 2, 2010
    public static Date strToDate(String string) {
        Date date=null;
        SimpleDateFormat format = new SimpleDateFormat("MMMM d, yyyy", Locale.ENGLISH);
        try {
            date = format.parse(string);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }

    public static String DaysToString(int time) {
        String result=null;

        String day= " day";
        String days=" days";
        String week= " week";
        String weeks= " weeks";
        String month= " month";
        String months= " months";

        int dys=time;
        int wks= time/7;
        int mnts= dys/17;

        if(mnts>1) {
            result=mnts+months;
        } else if(mnts==1) {
            result=mnts+month;
        } else if(wks>1) {
            result=wks+weeks;
        } else if(wks==1) {
            result=wks+week;
        } else if(dys>1) {
            result=dys+days;
        } else if(dys==1) {
            result=dys+day;
        } else {
            result=1+day;
        }

        return result;
    }



    //converts a date like 10-Jun-2015 15:01 to 10 June 15
    public static String strToShortTime(String str) {
        long timeInMillis = DateReformat(str);
        String dateString = DateFormat.format("dd MMM yy", new Date(timeInMillis)).toString();

        return dateString;
    }


    //logging commands
    public static void log(Integer str) {dump(str.toString(str));}
    public static void log(String str) {dump(str);}
    public static void log(JSONObject str) {dump(str);}
    public static void log(JSONArray str) {dump(str);}
    public static void log(Cursor str) {dump(str);}

    public static void dump(String str) {
        Log.i(TAG, str);}
    public static void dump(JSONObject str) {
        Log.i(TAG, str == null ? "empty json" : str.toString());}
    public static void dump(JSONArray str) {
        Log.i(TAG, str == null ? "empty array" : str.toString());}
    public static void dump(Cursor str) {
        Log.i(TAG, toJSONArray(str).toString());}

    public final static boolean isValidEmail(CharSequence target) {
        if (target == null) {
            return false;
        } else {
            return android.util.Patterns.EMAIL_ADDRESS.matcher(target).matches();
        }
    }


    public static void Pause(Integer ms) {
        long timer = ms.longValue();
        SystemClock.sleep(timer);
    }


    public static Boolean isOnline() {
        try
        {
            ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
            return cm.getActiveNetworkInfo().isConnectedOrConnecting();
        }
        catch (Exception e)
        {
            return false;
        }
    }

    public static final String md5(final String s) {
        final String MD5 = "MD5";
        try {
            // Create MD5 Hash
            MessageDigest digest = MessageDigest.getInstance(MD5);
            digest.update(s.getBytes());
            byte messageDigest[] = digest.digest();

            // Create Hex String
            StringBuilder hexString = new StringBuilder();
            for (byte aMessageDigest : messageDigest) {
                String h = Integer.toHexString(0xFF & aMessageDigest);
                while (h.length() < 2)
                    h = "0" + h;
                hexString.append(h);
            }
            return hexString.toString();

        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return "";
    }

    //checks if an activity is running
    public static boolean isRunning(Context ctx) {
        ActivityManager activityManager = (ActivityManager) ctx.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningTaskInfo> tasks = activityManager.getRunningTasks(Integer.MAX_VALUE);

        for (ActivityManager.RunningTaskInfo task : tasks) {
            if (ctx.getPackageName().equalsIgnoreCase(task.baseActivity.getPackageName()))
                return true;
        }

        return false;
    }

    //Check digits
    public static String checkDigit(int number)
    {
        return number<=9?"0"+number: String.valueOf(number);
    }

    public static JSONArray cur2Json(Cursor cursor) {

        JSONArray resultSet = new JSONArray();
        cursor.moveToFirst();
        while (cursor.isAfterLast() == false) {
            int totalColumn = cursor.getColumnCount();
            JSONObject rowObject = new JSONObject();
            for (int i = 0; i < totalColumn; i++) {
                if (cursor.getColumnName(i) != null) {
                    try {
                        rowObject.put(cursor.getColumnName(i),
                                cursor.getString(i));
                    } catch (Exception e) {
                        log( e.getMessage());
                    }
                }
            }
            resultSet.put(rowObject);
            cursor.moveToNext();
        }

        cursor.close();
        return resultSet;
    }


    //string to json
    public static JSONObject toJSON(String str) {
        JSONObject json=null;
        if(str!=null && !str.isEmpty()) {
            try {
                json = new JSONObject(str);
            } catch (JSONException e) {
                error_log = e.getMessage();
                e.printStackTrace();
            } catch (Exception e1) {
                e1.printStackTrace();
            }
        }
        return json;
    }


    //string to json
    public static JSONArray toJSONArray(String str) {
        JSONArray json=null;
        if(!str.isEmpty()) {
            try {
                json = new JSONArray(str);
            } catch (JSONException e) {
                error_log = e.getMessage();
                e.printStackTrace();
            } catch (Exception e1) {
                e1.printStackTrace();
            }
        }
        return json;
    }

    public static String base64Encode(String par) {
        return Base64.encodeToString(par.getBytes(), Base64.DEFAULT);
    }

    public static String base64Decode(String par) {
        if(par.isEmpty()) {return "";}
        byte[] data1 = Base64.decode(par, Base64.DEFAULT);
        String text1 = null;
        try {
            text1 = new String(data1, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            error_log=e.getMessage();
            e.printStackTrace();
        } catch (Exception e1) {
            e1.printStackTrace();
        }
        return text1;
    }

    //based on assumption that base64 does not contain spaces
    public static boolean is_base64(String data) {
        if(!data.contains(" ")){
            return true;
        } else {
            return false;
        }
    }



    //converts pixels to dp
    public static int pixelsToDP(int px, Context ctx) {
        return (int) (px * ctx.getResources().getDisplayMetrics().density);
    }


    //converts cursor to json
    public static JSONArray toJSONArray(Cursor cursor) {
        JSONArray resultSet = new JSONArray();
        cursor.moveToFirst();
        while (cursor.isAfterLast() == false) {
            int totalColumn = cursor.getColumnCount();
            JSONObject rowObject = new JSONObject();
            for (int i = 0; i < totalColumn; i++) {
                if (cursor.getColumnName(i) != null) {
                    try {
                        rowObject.put(cursor.getColumnName(i),
                                cursor.getString(i));
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }

            resultSet.put(rowObject);
            cursor.moveToNext();
        }

        cursor.close();
        return resultSet;
    }

    //check if we are running inside emulator
    public static boolean isRunningOnEmulator(final Context inContext) {

        final TelephonyManager theTelephonyManager = (TelephonyManager)inContext.getSystemService(Context.TELEPHONY_SERVICE);
        final boolean hasEmulatorImei = theTelephonyManager.getDeviceId().equals("000000000000000");
        final boolean hasEmulatorModelName = Build.MODEL.contains("google_sdk")
                || Build.MODEL.contains("Emulator")
                || Build.MODEL.contains("Android SDK");

        return hasEmulatorImei || hasEmulatorModelName;
    }

    //convert pixels to DP
    public static int toDP(int px) {
        return (int) (px * context.getResources().getDisplayMetrics().density);
    }

    /*
    unzip(new File("/sdcard/pictures.zip"), new File("/sdcard"));
     */
    public static void unzip(File zipFile, File targetDirectory) throws IOException {
        ZipInputStream zis = new ZipInputStream(
                new BufferedInputStream(new FileInputStream(zipFile)));
        try {
            ZipEntry ze;
            int count;
            byte[] buffer = new byte[8192];
            while ((ze = zis.getNextEntry()) != null) {
                File file = new File(targetDirectory, ze.getName());
                File dir = ze.isDirectory() ? file : file.getParentFile();
                if (!dir.isDirectory() && !dir.mkdirs())
                    throw new FileNotFoundException("Failed to ensure directory: " +
                            dir.getAbsolutePath());
                if (ze.isDirectory())
                    continue;
                FileOutputStream fout = new FileOutputStream(file);
                try {
                    while ((count = zis.read(buffer)) != -1)
                        fout.write(buffer, 0, count);
                } finally {
                    fout.close();
                }
            /* if time should be restored as well
            long time = ze.getTime();
            if (time > 0)
                file.setLastModified(time);
            */
            }
        } finally {
            zis.close();
        }
    }

    public static Uri urlToUri(String web_url) {
        URL url = null;
        try {
            url = new URL(web_url);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        Uri.Builder builder = new Uri.Builder()
                .scheme(url.getProtocol())
                .authority(url.getAuthority())
                .appendPath(url.getPath());
        return builder.build();
    }

    public static void log(ArrayList<String> result) {
        dump(result.toString());
    }

    public static String toTitleCase(String input) {
        StringBuilder titleCase = new StringBuilder();
        boolean nextTitleCase = true;

        for (char c : input.toCharArray()) {
            if (Character.isSpaceChar(c)) {
                nextTitleCase = true;
            } else if (nextTitleCase) {
                c = Character.toTitleCase(c);
                nextTitleCase = false;
            }

            titleCase.append(c);
        }

        return titleCase.toString();
    }


    //loads a JSON file from assets
    public static String loadJSONFromAsset(Context context, String file) {
        String json = null;
        try {
            InputStream is = context.getAssets().open(file);
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            json = new String(buffer, "UTF-8");
        } catch (IOException ex) {
            ex.printStackTrace();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return json;
    }


    public static void call_phone(Context context, String phone) {
        Intent intent = new Intent(Intent.ACTION_DIAL, Uri.fromParts("tel", phone, null));
        context.startActivity(intent);
    }


    public static void open_link(Context context, String url, String prompt) {
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
        context.startActivity(Intent.createChooser(intent, prompt));
    }

    //return fr or en
    public static String getLanguage() {
        String lang = Resources.getSystem().getConfiguration().locale.getDefault().getLanguage();
        return lang;
    }

    public static String getString(int str) {
        return getStr(str);
    }

        public static String getStr(int str) {
        String ret = null;
        try {
            ret = context.getResources().getString(str);
        } catch (NullPointerException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ret;
    }


    //basically refreshes the activity
    public static void RefreshActivity(Activity context) {
        Boolean Force=true;
        if (!Force && Build.VERSION.SDK_INT >= 11) {
            context.recreate();
        } else {
            context.finish();
            Intent myIntent = new Intent(context, context.getClass());
            context.startActivity(myIntent);
        }
    }

    public static void shareTextUrl(Context context, String Title, String Url, String Prompt) {
        Intent share = new Intent(Intent.ACTION_SEND);
        share.setType("text/plain");
        share.addFlags(Intent.FLAG_ACTIVITY_CLEAR_WHEN_TASK_RESET);

        // Add data to the intent, the receiving app will decide
        // what to do with it.
        share.putExtra(Intent.EXTRA_SUBJECT, Title);
        share.putExtra(Intent.EXTRA_TEXT, Url);

        context.startActivity(Intent.createChooser(share,Prompt));
    }


    public static void crash() {crash("This is a crash");}

    public static void crash(String message) {
        throw new RuntimeException(message);
    }


    //lang can be en or fr
    public static void ChangeLanguage(Activity context, String lang) {
        try {
            Locale locale = new Locale(lang);
            Locale.setDefault(locale);
            Configuration config = new Configuration();
            config.locale = locale;
            context.getBaseContext().getResources().updateConfiguration(config,
                    context.getBaseContext().getResources().getDisplayMetrics());
            RefreshActivity(context);
        } catch(NullPointerException e) {
            e.printStackTrace();
        }
    }


    public static String capitalize(String s) {
        if (s == null || s.length() == 0) {
            return "";
        }
        char first = s.charAt(0);
        if (Character.isUpperCase(first)) {
            return s;
        } else {
            return Character.toUpperCase(first) + s.substring(1);
        }
    }

    public static String getRealPathFromURI(Uri contentUri, Context context) {
        String[] proj      = {MediaStore.Images.Media.DATA};
        Cursor cursor       = context.getContentResolver().query( contentUri, proj, null, null,null);
        if (cursor == null) return null;
        int column_index    = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
        cursor.moveToFirst();
        return cursor.getString(column_index);
    }

    //returns the last fragment of a url e.g. youtube embed code
    public static String getLastBitFromUrl(final String url){
        return url.replaceFirst(".*/([^/?]+).*", "$1");
    }

    public static String getFileNameFromUrl(String url) {
        return url.substring(url.lastIndexOf("/")+1);
    }



    //read a file stored in the asset folder
    public static String read_file_from_asset(String fileName, Context context) {
        StringBuilder returnString = new StringBuilder();
        InputStream fIn = null;
        InputStreamReader isr = null;
        BufferedReader input = null;
        try {
            fIn = context.getResources().getAssets().open(fileName, Context.MODE_WORLD_READABLE);
            isr = new InputStreamReader(fIn);
            input = new BufferedReader(isr);
            String line = "";
            while ((line = input.readLine()) != null) {
                returnString.append(line);
            }
        } catch (Exception e) {
            e.getMessage();
        } finally {
            try {
                if (isr != null)
                    isr.close();
                if (fIn != null)
                    fIn.close();
                if (input != null)
                    input.close();
            } catch (Exception e2) {
                e2.getMessage();
            }
        }
        return returnString.toString();
    }

    public static String nl2br(String string) {
        return (string != null) ? string.replace("\n", "<br/>") : null;
    }


    public static Boolean copyURLToFile(String url, File file) throws IOException {
        URL u=null;

        try {
            u = new URL(url);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }

        return copyURLToFile(u,file);
    }

    public static Boolean copyURLToFile(URL url, File file) throws IOException {
        Boolean response=false;


        URLConnection conection = url.openConnection();
        conection.connect();

        // this will be useful so that you can show a tipical 0-100%
        // progress bar
        int lenghtOfFile = conection.getContentLength();

        // download the file
        InputStream input = new BufferedInputStream(url.openStream(),
                8192);

        // Output stream
        OutputStream output = new FileOutputStream(file);

        byte data[] = new byte[1024];

        long total = 0;
        int count;

        while ((count = input.read(data)) != -1) {
            total += count;
            // publishing the progress....
            // After this onProgressUpdate will be called
            //publishProgress("" + (int) ((total * 100) / lenghtOfFile));

            // writing data to file
            output.write(data, 0, count);
        }

        // flushing output
        output.flush();

        // closing streams
        output.close();
        input.close();

        return response;
    }


    public static String getFile(String url) {
        HttpHandler sh = new HttpHandler();
        // Making a request to url and getting response
        String strFile = sh.makeServiceCall(url).trim();
        return strFile;
    }

    public static String getFile2(String url) {


        URL u=null;

        byte data[] = new byte[1024];

        long total = 0;
        int count;



        URLConnection conection = null;
        try {
            u = new URL(url);

            conection = u.openConnection();
            conection.connect();

        // this will be useful so that you can show a tipical 0-100%
        // progress bar
        int lenghtOfFile = conection.getContentLength();

        // download the file
        InputStream input = new BufferedInputStream(u.openStream(),
                8192);




        while ((count = input.read(data)) != -1) {
            total += count;
            // publishing the progress....
            // After this onProgressUpdate will be called
            //publishProgress("" + (int) ((total * 100) / lenghtOfFile));

            // writing data to file
            //output.write(data, 0, count);
        }


        // closing streams
        input.close();

        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }


        return "Length is "+total;
    }



    public static String loadAssetTextAsString(Context context, String name) {
        BufferedReader in = null;
        try {
            StringBuilder buf = new StringBuilder();
            InputStream is = context.getAssets().open(name);
            in = new BufferedReader(new InputStreamReader(is));

            String str;
            boolean isFirst = true;
            while ( (str = in.readLine()) != null ) {
                if (isFirst)
                    isFirst = false;
                else
                    buf.append('\n');
                buf.append(str);
            }
            return buf.toString();
        } catch (IOException e) {
            Log.e(TAG, "Error opening asset " + name);
        } catch (java.lang.NullPointerException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e) {
                    Log.e(TAG, "Error closing asset " + name);
                }
            }
        }

        return null;
    }



    public static boolean file_exists(String file, Context mContext) {
        Boolean response=false;
        InputStream inputStream = null;
        try {
            inputStream = mContext.openFileInput(file);

            if (inputStream != null) {
                inputStream.close();
                response = true;
            }
        } catch (java.lang.NullPointerException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;

    }
}
