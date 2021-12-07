package fr.brgm.mapClient.utils.file;

import java.io.*;

/**
 * Writes file (Imported from Swing project (MiMS))
 */
public class FileWriter {

    /**
     * Writes the content into an output file.
     *
     * @param output  Output file.
     * @param content Content to write into the output file.
     * @throws IOException
     */
    public static void write(File output, String content) throws IOException {
        PrintWriter PrintFileWriter;
        PrintFileWriter = new PrintWriter(new java.io.FileWriter(output), true);
        PrintFileWriter.print(content);
        PrintFileWriter.close();
    }

    /**
     * Writes the content into an output file.
     *
     * @param pathToFile Output file name.
     * @param content    Content to write into the output file.
     * @throws IOException
     */
    public static void write(String pathToFile, byte[] content) throws IOException {
        File file = new File(pathToFile);
        try (OutputStream os = new FileOutputStream(file)) {
            os.write(content);
        }
    }
}
