package com.samples;

import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManagerFactory;

/**
 * This class is a utility class that provides for persistence.
 *
 * @author dacton@google.com (Daniel Acton)
 */
public final class PMF {
  private static final PersistenceManagerFactory pmfInstance =
      JDOHelper.getPersistenceManagerFactory("transactions-optional");

  private PMF() {}

  public static PersistenceManagerFactory get() {
    return pmfInstance;
  }
}
