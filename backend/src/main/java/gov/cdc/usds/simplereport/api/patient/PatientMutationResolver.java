package gov.cdc.usds.simplereport.api.patient;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import gov.cdc.usds.simplereport.service.PersonService;
import graphql.kickstart.tools.GraphQLMutationResolver;
import org.springframework.stereotype.Component;

/**
 * Created by nickrobison on 11/17/20
 */
@Component
public class PatientMutationResolver implements GraphQLMutationResolver  {
    private static DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final PersonService _ps;
  
    public PatientMutationResolver(PersonService ps) {
        _ps = ps;
    }

    public void addPatient(
        String lookupId,
        String firstName,
        String middleName,
        String lastName,
        String birthDate,
        String street,
        String street2,
        String city,
        String state,
        String zipCode,
        String telephone,
        String typeOfHealthcareProfessional,
        String email,
        String county,
        String race,
        String ethnicity,
        String gender,
        Boolean residentCongregateSetting,
        Boolean employedInHealthcare
    ) {
      LocalDate localBirthDateDate = (birthDate == null) ? null : LocalDate.parse(birthDate, this.dateTimeFormatter);
      _ps.addPatient(
            lookupId,
            firstName,
            middleName,
            lastName,
            (birthDate == null) ? null : LocalDate.parse(birthDate, this.dateTimeFormatter),
            street,
            street2,
            city,
            state,
            zipCode,
            telephone,
            typeOfHealthcareProfessional,
            email,
            county,
            race,
            ethnicity,
            gender,
            residentCongregateSetting,
            employedInHealthcare
        );
    }

    public void updatePatient(
      String patientId,
      String lookupId,
      String firstName,
      String middleName,
      String lastName,
      String birthDate,
      String street,
      String street2,
      String city,
      String state,
      String zipCode,
      String telephone,
      String typeOfHealthcareProfessional,
      String email,
      String county,
      String race,
      String ethnicity,
      String gender,
      Boolean residentCongregateSetting,
      Boolean employedInHealthcare
  ) {
      LocalDate localBirthDateDate = (birthDate == null) ? null : LocalDate.parse(birthDate, this.dateTimeFormatter);
      _ps.updatePatient(
          patientId,
          lookupId,
          firstName,
          middleName,
          lastName,
          (birthDate == null) ? null : LocalDate.parse(birthDate, this.dateTimeFormatter),
          street,
          street2,
          city,
          state,
          zipCode,
          telephone,
          typeOfHealthcareProfessional,
          email,
          county,
          race,
          ethnicity,
          gender,
          residentCongregateSetting,
          employedInHealthcare
      );
  }
}