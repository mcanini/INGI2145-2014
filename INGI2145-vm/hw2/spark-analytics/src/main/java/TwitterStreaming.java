import org.apache.spark.api.java.*;
import org.apache.spark.api.java.function.*;
import org.apache.spark.streaming.*;
import org.apache.spark.streaming.api.java.*;
import org.apache.spark.streaming.kafka.*;
import java.util.Arrays;
import java.util.*;
import scala.Tuple2;

public class TwitterStreaming {

  public static void main(String[] args) throws Exception {
    // Location of the Spark directory
    String sparkHome = "/usr/local/spark";
    // URL of the Spark cluster
    String sparkUrl = "local[4]";
    // Location of the required JAR files
    String jarFile = "target/streaming-1.0.jar";

    // TODO
  }

}
