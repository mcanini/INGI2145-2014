package be_uclouvain_ingi2145_p1;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;
import org.apache.log4j.Appender;
import org.apache.log4j.ConsoleAppender;
import org.apache.log4j.FileAppender;
import org.apache.log4j.Level;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.apache.log4j.SimpleLayout;
import org.apache.log4j.varia.LevelRangeFilter;

public class SocialRankDriver extends Configured implements Tool
{
    /**
     * Singleton instance.
     */
    public static SocialRankDriver GET;

    /**
     * Number of iterations to perform in between diff checks.
     */
    public static final double DIFF_INTERVAL = 3;

    /**
     * Author's name.
     */
    public static final String NAME = "HEY YOU, WRITE YOUR NAME HERE";

    // ---------------------------------------------------------------------------------------------

    public static void main(String[] args) throws Exception
    {
        // configure log4j to output to a file
        Logger logger = LogManager.getRootLogger();
        logger.addAppender(new FileAppender(new SimpleLayout(), "p1.log"));

        // configure log4j to output to the console
        Appender consoleAppender = new ConsoleAppender(new SimpleLayout());
        LevelRangeFilter filter = new LevelRangeFilter();
        // switch to another level for more detail (own (INGI2145) messages use FATAL)
        filter.setLevelMin(Level.ERROR);
        consoleAppender.addFilter(filter);
        // (un)comment to (un)mute console output
        logger.addAppender(consoleAppender);

        // switch to Level.DEBUG or Level.TRACE for more detail
        logger.setLevel(Level.INFO);

        GET = new SocialRankDriver();
        Configuration conf = new Configuration();

        int res = ToolRunner.run(conf, GET, args);
        System.exit(res);
    }

    // ---------------------------------------------------------------------------------------------

    @Override
    public int run(String[] args) throws Exception
    {
        System.out.println(NAME);

        if (args.length == 0) {
            args = new String[]{ "command missing" };
        }

        switch (args[0]) {
            case "init":
                init(args[1], args[2], Integer.parseInt(args[3]));
                break;
            case "iter":
                iter(args[1], args[2], Integer.parseInt(args[3]));
                break;
            case "diff":
                diff(args[1], args[2], args[3], args[4], Integer.parseInt(args[5]));
                break;
            case "finish":
                finish(args[1], args[2], args[3], Integer.parseInt(args[4]));
                break;
            case "composite":
                composite(args[1], args[2], args[3], args[4], args[5],
                    args[6], Double.parseDouble(args[7]), Integer.parseInt(args[8]));
                break;
            default:
                System.out.println("Unknown command: " + args[0]);
                break;
        }

        return 0;
    }

    // ---------------------------------------------------------------------------------------------

    void init(String inputDir, String outputDir, int nReducers) throws Exception
    {
        Logger.getRootLogger().fatal("[INGI2145] init");

        // TODO
    }

    // ---------------------------------------------------------------------------------------------

    void iter(String inputDir, String outputDir, int nReducers) throws Exception
    {
        Logger.getRootLogger().fatal("[INGI2145] iter: " + inputDir + " (to) " + outputDir);

        // TODO
    }

    // ---------------------------------------------------------------------------------------------

    double diff(String inputDir1, String inputDir2, String tmpDir, String outputDir, int nReducers)
    throws Exception
    {
        Logger.getRootLogger().fatal("[INGI2145] diff");

        // TODO

        double diffResult = Utils.readDiffResult(outputDir);
        Logger.getRootLogger().fatal("[INGI2145] diff was " + diffResult);
        return diffResult;
    }

    // ---------------------------------------------------------------------------------------------

    void finish(String inputDir, String tmpDir, String outputDir, int nReducers) throws Exception
    {
        Logger.getRootLogger().fatal("[INGI2145] finish from:" + inputDir);

        // TODO
    }

    // ---------------------------------------------------------------------------------------------

    void composite(String inputDir, String outputDir, String intermDir1, String intermDir2,
                   String diffDir, String tmpDiffDir, double delta, int nReducers) throws Exception
    {
        // TODO
    }
}