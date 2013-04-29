package com.samples;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.datanucleus.query.JDOCursorHelper;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

/**
 * This class is the endpoint for the Business Card API.
 *
 * @author dacton@google.com (Daniel Acton)
 */
@Api(name = "businesscard", version = "v1", description = "Sample API")
public class BusinessCardEndpoint {

  /**
   * List all business cards
   *
   * @param cursorString An optional parameter used in paging.
   * @param limit An optional parameter used in paging.
   * @return A list of business card entities.
   */
  @SuppressWarnings({"cast", "unchecked", "unused"})
  @ApiMethod(name = "list", path = "/list", httpMethod = HttpMethod.GET)
  public CollectionResponse<BusinessCard> listBusinessCards(
      @Nullable @Named("cursor") String cursorString, @Nullable @Named("limit") Integer limit) {
    PersistenceManager mgr = null;
    Cursor cursor = null;
    List<BusinessCard> execute = null;
    try {
      mgr = PMF.get().getPersistenceManager();
      Query query = mgr.newQuery(BusinessCard.class);
      if (cursorString != null && cursorString != "") {
        cursor = Cursor.fromWebSafeString(cursorString);
        Map<String, Object> extensionMap = new HashMap<String, Object>();
        extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
        query.setExtensions(extensionMap);
      }
      if (limit != null) {
        query.setRange(0, limit);
      }
      execute = (List<BusinessCard>) query.execute();
      cursor = JDOCursorHelper.getCursor(execute);
      if (cursor != null) {
        cursorString = cursor.toWebSafeString();
      } else {
        cursorString = "";
      }
      // Tight loop for fetching all entities from datastore and accomodate
      // for lazy fetch.
      for (BusinessCard e : execute);
    } finally {
      try {
        mgr.close();
      } catch (Exception e) {
      }
    }

    return CollectionResponse.<BusinessCard>builder()
        .setItems(execute).setNextPageToken(cursorString).build();
  }

  /**
   * Read a single business card, using the HTTP GET method.
   *
   * @param id The primary key of the business card to read.
   * @return The business card entity
   */
  @ApiMethod(name = "read", httpMethod = HttpMethod.GET, path = "businesscard/{id}")
  public BusinessCard getBusinessCard(@Named("id") Long id) {
    PersistenceManager mgr = PMF.get().getPersistenceManager();
    BusinessCard card = null;
    try {
      card = mgr.getObjectById(BusinessCard.class, id);
    } catch (Exception e) {
      card = null;
    } finally {
      mgr.close();
    }
    return card;
  }


  /**
   * Create a new business card, using the HTTP POST method
   *
   * @param card the entity to be created.
   * @return The created entity.
   */
  @ApiMethod(name = "create", httpMethod = HttpMethod.POST, path = "businesscard")
  public BusinessCard insertBusinessCard(BusinessCard card) {
    card.setLastModified(new Date());
    card.setCreated(new Date());
    PersistenceManager mgr = PMF.get().getPersistenceManager();
    try {
      mgr.makePersistent(card);
    } finally {
      mgr.close();
    }
    return card;
  }

  /**
   * This method is used for updating a entity. It uses HTTP PUT method.
   *
   * @param card the entity to be updated.
   * @return The updated entity.
   */
  @ApiMethod(name = "update", httpMethod = HttpMethod.PUT, path = "businesscard/{id}")
  public BusinessCard updateBusinessCard(BusinessCard card) {
    card = BusinessCard.Merge(getBusinessCard(card.getId()), card);
    card.setLastModified(new Date());
    PersistenceManager mgr = PMF.get().getPersistenceManager();
    try {
      mgr.makePersistent(card);
    } finally {
      mgr.close();
    }
    return card;
  }

  /**
   * This method removes the entity with primary key id. It uses HTTP DELETE method.
   *
   * @param id the primary key of the entity to be deleted.
   * @return The deleted entity.
   */
  @ApiMethod(name = "remove", httpMethod = HttpMethod.DELETE, path = "businesscard/{id}")
  public BusinessCard removeBusinessCard(@Named("id") Long id) {
    PersistenceManager mgr = PMF.get().getPersistenceManager();
    BusinessCard card = null;

    // We need to return a copy of the object otherwise the client-side might
    // have trouble reading an already-deleted object
    BusinessCard cardClone = new BusinessCard();
    try {
      card = mgr.getObjectById(BusinessCard.class, id);
      BusinessCard.Merge(cardClone, card);
      mgr.deletePersistent(card);
    } finally {
      mgr.close();
    }

    return cardClone;
  }

}
