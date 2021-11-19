package gov.cdc.usds.simplereport.config;

import gov.cdc.usds.simplereport.api.DefaultArgumentValidation;
import graphql.validation.rules.OnValidationErrorStrategy;
import graphql.validation.rules.ValidationRules;
import graphql.validation.schemawiring.ValidationSchemaWiring;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GraphQlSchemaDirectiveConfig {
  public static final String REQUIRED_PERMISSIONS_DIRECTIVE_NAME = "requiredPermissions";
  public static final int MAXIMUM_SIZE = 256;

  @Bean
  public ValidationSchemaWiring validationDirectives() {
    ValidationRules validationRules =
        ValidationRules.newValidationRules()
            .addRule(new DefaultArgumentValidation(MAXIMUM_SIZE))
            .onValidationErrorStrategy(OnValidationErrorStrategy.RETURN_NULL)
            .build();

    return new ValidationSchemaWiring(validationRules);
  }
}
