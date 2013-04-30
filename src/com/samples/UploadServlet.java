package com.samples;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * This class is a utility that provides the Blobstore serving URLs for the uploaded images. To use
 * it, POST to the URL and a JSON response containing fullUrl and thumbnailUrl will be returned.
 *
 * @author dacton@google.com (Daniel Acton)
 */
public class UploadServlet extends HttpServlet {

  private static final long serialVersionUID = 5994297590679742101L;
  private final BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
  DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
  ImagesService imagesService = ImagesServiceFactory.getImagesService();

  @Override
  public void doPost(HttpServletRequest req, HttpServletResponse res)
      throws ServletException, IOException {

    Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(req);

    for (String mk : blobs.keySet()) {

      List<BlobKey> keys = blobs.get(mk);

      for (BlobKey k : keys) {
        // Create 2 URLs - one for normal size image
        // the other for a 100px wide image
        ServingUrlOptions soOriginal = ServingUrlOptions.Builder.withBlobKey(k);
        ServingUrlOptions soThumb = ServingUrlOptions.Builder.withBlobKey(k).imageSize(100);
        String origUrl = imagesService.getServingUrl(soOriginal);
        String thumbUrl = imagesService.getServingUrl(soThumb);

        JsonObject jsonResponse = new JsonObject();
        jsonResponse.addProperty("thumbnailUrl", thumbUrl);
        jsonResponse.addProperty("fullUrl", origUrl);

        res.setContentType("application/json");
        res.getWriter().write(jsonResponse.toString());
      }
    }
  }
}
