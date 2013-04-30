package com.samples;

import java.util.Date;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

/**
 * This class represents a BusinessCard entity.
 *
 * @author dacton@google.com (Daniel Acton)
 */
@PersistenceCapable
public class BusinessCard {

  @PrimaryKey
  @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
  private Long id;
  @Persistent
  private String name;
  @Persistent
  private String thumbnailUrl;
  @Persistent
  private String fullUrl;
  @Persistent
  private String latitude;
  @Persistent
  private String longitude;
  @Persistent
  private Date created;
  @Persistent
  private Date lastModified;

  public BusinessCard() {

  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  /**
   * @return the name
   */
  public String getName() {
    return name;
  }

  /**
   * @param name the name to set
   */
  public void setName(String name) {
    this.name = name;
  }

  /**
   * @return the thumbnailUrl
   */
  public String getThumbnailUrl() {
    return thumbnailUrl;
  }

  /**
   * @param thumbnailUrl the thumbnailUrl to set
   */
  public void setThumbnailUrl(String thumbnailUrl) {
    this.thumbnailUrl = thumbnailUrl;
  }

  /**
   * @return the fullUrl
   */
  public String getFullUrl() {
    return fullUrl;
  }

  /**
   * @param fullUrl the fullUrl to set
   */
  public void setFullUrl(String fullUrl) {
    this.fullUrl = fullUrl;
  }

  /**
   * Merge 2 business cards into a single business card
   *
   * @param orgCard The mergee
   * @param newCard The mergand
   * @return The merged business card
   */
  public static BusinessCard Merge(BusinessCard orgCard, BusinessCard newCard) {
    if (newCard.getFullUrl() != null) orgCard.setFullUrl(newCard.getFullUrl());
    if (newCard.getThumbnailUrl() != null) orgCard.setThumbnailUrl(newCard.getThumbnailUrl());
    if (newCard.getLatitude() != null) orgCard.setLatitude(newCard.getLatitude());
    if (newCard.getLongitude() != null) orgCard.setLongitude(newCard.getLongitude());
    if (newCard.getName() != null) orgCard.setName(newCard.getName());
    if (newCard.getCreated() != null) orgCard.setCreated(newCard.getCreated());
    if (newCard.getLastModified() != null) orgCard.setLastModified(newCard.getLastModified());
    return orgCard;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public Date getLastModified() {
    return lastModified;
  }

  public void setLastModified(Date lastModified) {
    this.lastModified = lastModified;
  }

  public String getLatitude() {
    return latitude;
  }

  public void setLatitude(String latitude) {
    this.latitude = latitude;
  }

  public String getLongitude() {
    return longitude;
  }

  public void setLongitude(String longitude) {
    this.longitude = longitude;
  }
}
