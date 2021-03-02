package gov.cdc.usds.simplereport.test_util;

import gov.cdc.usds.simplereport.api.pxp.CurrentPatientContextHolder;
import gov.cdc.usds.simplereport.config.AuditingConfig;
import gov.cdc.usds.simplereport.config.AuthorizationProperties;
import gov.cdc.usds.simplereport.config.InitialSetupProperties;
import gov.cdc.usds.simplereport.config.authorization.AuthorizationServiceConfig;
import gov.cdc.usds.simplereport.config.authorization.DemoUserIdentitySupplier;
import gov.cdc.usds.simplereport.config.authorization.OrganizationExtractor;
import gov.cdc.usds.simplereport.config.simplereport.DataHubConfig;
import gov.cdc.usds.simplereport.config.simplereport.DemoUserConfiguration;
import gov.cdc.usds.simplereport.config.simplereport.DemoUserConfiguration.DemoUser;
import gov.cdc.usds.simplereport.config.simplereport.SiteAdminEmailList;
import gov.cdc.usds.simplereport.idp.repository.DemoOktaRepository;
import gov.cdc.usds.simplereport.service.ApiUserService;
import gov.cdc.usds.simplereport.service.OrganizationInitializingService;
import gov.cdc.usds.simplereport.service.OrganizationService;
import gov.cdc.usds.simplereport.service.model.IdentitySupplier;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.List;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;

/**
 * Bean creation and wiring required to get slice tests to run without a full application context
 * being created. This is not annotated with a Spring stereotype because we very much do not want it
 * to be picked up automatically!
 */
@Import({
  TestDataFactory.class,
  AuditingConfig.class,
  DemoOktaRepository.class,
  AuthorizationServiceConfig.class,
  OrganizationExtractor.class,
  OrganizationService.class,
  ApiUserService.class,
  OrganizationInitializingService.class,
  CurrentPatientContextHolder.class
})
@EnableConfigurationProperties({
  InitialSetupProperties.class,
  AuthorizationProperties.class,
  SiteAdminEmailList.class,
  DataHubConfig.class,
  DemoUserConfiguration.class,
})
public class SliceTestConfiguration {

  @Bean
  public IdentitySupplier testIdentityProvider() {
    return new DemoUserIdentitySupplier(
        List.of(
            new DemoUser(null, TestUserIdentities.STANDARD_USER_ATTRIBUTES),
            new DemoUser(null, TestUserIdentities.SITE_ADMIN_USER_ATTRIBUTES)));
  }

  @Retention(RetentionPolicy.RUNTIME)
  @Target({ElementType.METHOD, ElementType.TYPE})
  @WithMockUser(
      username = TestUserIdentities.STANDARD_USER,
      authorities = {"TEST-TENANT:DIS_ORG:USER"})
  @Inherited
  public @interface WithSimpleReportStandardUser {}

  @Retention(RetentionPolicy.RUNTIME)
  @Target({ElementType.METHOD, ElementType.TYPE})
  @WithMockUser(
      username = TestUserIdentities.STANDARD_USER,
      authorities = {"TEST-TENANT:DIS_ORG:USER", "TEST-TENANT:DIS_ORG:ADMIN"})
  @Inherited
  public @interface WithSimpleReportOrgAdminUser {}

  @Retention(RetentionPolicy.RUNTIME)
  @Target({ElementType.METHOD, ElementType.TYPE})
  @WithMockUser(
      username = TestUserIdentities.STANDARD_USER,
      authorities = {"TEST-TENANT:DIS_ORG:USER", "TEST-TENANT:DIS_ORG:ENTRY_ONLY"})
  @Inherited
  public @interface WithSimpleReportEntryOnlyUser {}

  @Retention(RetentionPolicy.RUNTIME)
  @Target({ElementType.METHOD, ElementType.TYPE})
  @WithMockUser(
      username = TestUserIdentities.SITE_ADMIN_USER,
      authorities = {"TEST-TENANT:DIS_ORG:USER"})
  @Inherited
  public @interface WithSimpleReportSiteAdminUser {}
}
