package be_uclouvain_ingi2145_p1;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;

public class Utils
{
    /**
     * Delete the given folder.
     */
    public static void deleteDir(String path)
    {
        try {
            FileSystem fs = FileSystem.get(URI.create(path), SocialRankDriver.GET.getConf());
            Path p = new Path(path);

            if (fs.exists(p)) {
                fs.delete(p, true);
            }

            fs.close();
        }
        catch (Exception e)
        {
            throw new RuntimeException(e);
        }
    }

    // ---------------------------------------------------------------------------------------------

    /**
     * Given an output folder, returns the first double from the first part-r-00000 file.
     */
    static double readDiffResult(String path) throws Exception
    {
        double diff = 0.0;
        Path p = new Path(path);
        FileSystem fs = FileSystem.get(SocialRankDriver.GET.getConf());

        if (fs.exists(p))
        {
            FileStatus[] ls = fs.listStatus(p);

            for (FileStatus file : ls)
            {
                if (file.getPath().getName().startsWith("part-r-00000"))
                {
                    FSDataInputStream in = fs.open(file.getPath());
                    BufferedReader reader = new BufferedReader(new InputStreamReader(in));
                    String content = reader.readLine();
                    diff = Double.parseDouble(content);
                    reader.close();
                }
            }
        }

        fs.close();
        return diff;
    }

    // ---------------------------------------------------------------------------------------------

    /**
     * Creates and configures a Hadoop job with most of the required parameters.
     */
    public static Job configureJob(String inputDir, String outputDir,
                     Class<? extends Mapper>    mapClass,
                     Class<? extends Reducer>   combineClass,
                     Class<? extends Reducer>   reduceClass,
                     Class<?> reduceKey, Class<?> reduceValue,
                     Class<?> outputKey, Class<?> outputValue,
                     int nReducers)
        throws Exception
    {
        Utils.deleteDir(outputDir);

        Job job = Job.getInstance(SocialRankDriver.GET.getConf());
        job.setJarByClass(SocialRankDriver.class);
        FileOutputFormat.setOutputPath(job, new Path(outputDir));
        FileInputFormat.addInputPath(job, new Path(inputDir));
        job.setMapperClass(mapClass);

        if (combineClass != null) {
            job.setCombinerClass(combineClass);
        }

        job.setReducerClass(reduceClass);
        job.setMapOutputKeyClass(reduceKey);
        job.setMapOutputValueClass(reduceValue);
        job.setOutputKeyClass(outputKey);
        job.setOutputValueClass(outputValue);
        job.setNumReduceTasks(nReducers);

        return job;
    }

    // ---------------------------------------------------------------------------------------------

    /**
     * Run the given job, wait for it to complete and throws a runtime exception if it fails.
     */
    public static void startJob(Job job) throws Exception
    {
        if (!job.waitForCompletion(true)) {
            throw new RuntimeException("job failed: " + job);
        }
    }
}
