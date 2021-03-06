package gov.cdc.usds.simplereport.test_util;

import gov.cdc.usds.simplereport.service.model.IdentityAttributes;
import java.util.List;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

public class TestUserIdentities {

  public static final String DEFAULT_ORGANIZATION = "DIS_ORG";

  public static final String SITE_ADMIN_USER = "ruby@example.com";
  public static final String STANDARD_USER = "bobbity@example.com";
  public static final String ENTRY_ONLY_USER = "nobody@example.com";
  public static final String ORG_ADMIN_USER = "admin@example.com";

  public static final String OTHER_ORG_USER = "intruder@pirate.com";
  public static final String OTHER_ORG_ADMIN = "captain@pirate.com";

  public static final String BROKEN_USER = "castaway@pirate.com";

  public static final IdentityAttributes STANDARD_USER_ATTRIBUTES =
      new IdentityAttributes(STANDARD_USER, "Bobbity", "Bob", "Bobberoo", null);
  public static final IdentityAttributes SITE_ADMIN_USER_ATTRIBUTES =
      new IdentityAttributes(SITE_ADMIN_USER, "Ruby", "Raven", "Reynolds", null);
  /**
   * Set the security context to hold a particular user, then run some code, then reset the user.
   *
   * @param username a username that is known to the current IdentitySupplier
   * @param nested a lambda to run
   */
  public static void withUser(String username, Runnable nested) {
    SecurityContext context = SecurityContextHolder.getContext();
    Authentication original = context.getAuthentication();
    try {
      context.setAuthentication(new TestingAuthenticationToken(username, null, List.of()));
      nested.run();
    } finally {
      context.setAuthentication(original);
    }
  }
  /**
   * Set the security context to hold the "default" user ({@link STANDARD_USER}), then run some
   * code, then reset the user.
   *
   * @param nested a lambda to run
   */
  public static void withStandardUser(Runnable nested) {
    withUser(STANDARD_USER, nested);
  }
}
