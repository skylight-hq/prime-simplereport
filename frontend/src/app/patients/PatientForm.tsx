import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import {
  useAppInsightsContext,
  useTrackEvent,
} from "@microsoft/applicationinsights-react-js";
import moment from "moment";
import { Prompt } from "react-router-dom";
import { Redirect } from "react-router";

import {
  PATIENT_TERM_PLURAL_CAP,
  PATIENT_TERM_CAP,
  stateCodes,
} from "../../config/constants";
import { RACE_VALUES, ETHNICITY_VALUES, GENDER_VALUES } from "../constants";

import Breadcrumbs from "../commonComponents/Breadcrumbs";
import TextInput from "../commonComponents/TextInput";
import RadioGroup from "../commonComponents/RadioGroup";
import RequiredMessage from "../commonComponents/RequiredMessage";
import Dropdown from "../commonComponents/Dropdown";
import { displayFullName, showError, showNotification } from "../utils";
import "./EditPatient.scss";
import Alert from "../commonComponents/Alert";
import FormGroup from "../commonComponents/FormGroup";
import { useSelector } from "react-redux";

const ADD_PATIENT = gql`
  mutation AddPatient(
    $facilityId: String
    $lookupId: String
    $firstName: String!
    $middleName: String
    $lastName: String!
    $birthDate: LocalDate!
    $street: String!
    $streetTwo: String
    $city: String
    $state: String!
    $zipCode: String!
    $telephone: String!
    $role: String
    $email: String
    $county: String
    $race: String
    $ethnicity: String
    $gender: String
    $residentCongregateSetting: Boolean!
    $employedInHealthcare: Boolean!
  ) {
    addPatient(
      facilityId: $facilityId
      lookupId: $lookupId
      firstName: $firstName
      middleName: $middleName
      lastName: $lastName
      birthDate: $birthDate
      street: $street
      streetTwo: $streetTwo
      city: $city
      state: $state
      zipCode: $zipCode
      telephone: $telephone
      role: $role
      email: $email
      county: $county
      race: $race
      ethnicity: $ethnicity
      gender: $gender
      residentCongregateSetting: $residentCongregateSetting
      employedInHealthcare: $employedInHealthcare
    )
  }
`;

const UPDATE_PATIENT = gql`
  mutation UpdatePatient(
    $facilityId: String
    $patientId: String!
    $lookupId: String
    $firstName: String!
    $middleName: String
    $lastName: String!
    $birthDate: LocalDate!
    $street: String!
    $streetTwo: String
    $city: String
    $state: String!
    $zipCode: String!
    $telephone: String!
    $role: String
    $email: String
    $county: String
    $race: String
    $ethnicity: String
    $gender: String
    $residentCongregateSetting: Boolean!
    $employedInHealthcare: Boolean!
  ) {
    updatePatient(
      facilityId: $facilityId
      patientId: $patientId
      lookupId: $lookupId
      firstName: $firstName
      middleName: $middleName
      lastName: $lastName
      birthDate: $birthDate
      street: $street
      streetTwo: $streetTwo
      city: $city
      state: $state
      zipCode: $zipCode
      telephone: $telephone
      role: $role
      email: $email
      county: $county
      race: $race
      ethnicity: $ethnicity
      gender: $gender
      residentCongregateSetting: $residentCongregateSetting
      employedInHealthcare: $employedInHealthcare
    )
  }
`;

interface Props {
  activeFacilityId: string;
  patientId?: string;
  patient?: any; //TODO: TYPES
}

const PatientForm = (props: Props) => {
  const appInsights = useAppInsightsContext();
  const trackAddPatient = useTrackEvent(appInsights, "Add Patient", {});
  const trackUpdatePatient = useTrackEvent(appInsights, "Update Patient", {});

  const [addPatient] = useMutation(ADD_PATIENT);
  const [updatePatient] = useMutation(UPDATE_PATIENT);
  const [formChanged, setFormChanged] = useState(false);
  const [patient, setPatient] = useState(props.patient);
  const [submitted, setSubmitted] = useState(false);

  const allFacilities = "~~ALL-FACILITIES~~";
  const [currentFacilityId, setCurrentFacilityId] = useState(
    patient.facility === null ? allFacilities : patient.facility?.id
  );
  const facilities = useSelector(
    (state) => (state as any).facilities as Facility[]
  );
  const facilityList = facilities.map((f: any) => ({
    label: f.name,
    value: f.id,
  }));
  facilityList.unshift({ label: "All facilities", value: allFacilities });
  facilityList.unshift({ label: "-Select-", value: "" });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let value: string | null = e.target.value;
    if (e.target.type === "checkbox") {
      value = {
        ...patient[e.target.name],
        [e.target.value]: (e.target as any).checked,
      };
    } else if (value === allFacilities) {
      value = null;
    }
    setFormChanged(true);
    setPatient({ ...patient, [e.target.name]: value });
  };
  const fullName = displayFullName(
    patient.firstName,
    patient.middleName,
    patient.lastName
  );

  const savePatientData = () => {
    setFormChanged(false);
    const variables = {
      facilityId:
        currentFacilityId === allFacilities ? null : currentFacilityId,
      lookupId: patient.lookupId,
      firstName: patient.firstName,
      middleName: patient.middleName,
      lastName: patient.lastName,
      birthDate: patient.birthDate,
      street: patient.street,
      streetTwo: patient.streetTwo,
      city: patient.city,
      state: patient.state,
      zipCode: patient.zipCode,
      telephone: patient.telephone,
      role: patient.role,
      email: patient.email,
      county: patient.county,
      race: patient.race,
      ethnicity: patient.ethnicity,
      gender: patient.gender,
      residentCongregateSetting: patient.residentCongregateSetting === "YES",
      employedInHealthcare: patient.employedInHealthcare === "YES",
    };
    if (props.patientId) {
      trackUpdatePatient({});
      updatePatient({
        variables: {
          patientId: props.patientId,
          ...variables,
        },
      }).then(
        () => {
          showNotification(
            toast,
            <Alert
              type="success"
              title={`${PATIENT_TERM_CAP} Record Saved`}
              body="Information record has been updated."
            />
          );
          setSubmitted(true);
        },
        (error) => {
          appInsights.trackException(error);
          showError(
            toast,
            `${PATIENT_TERM_CAP} Data Error`,
            "Please check for missing data or typos."
          );
        }
      );
    } else {
      trackAddPatient({});
      addPatient({ variables }).then(
        () => {
          showNotification(
            toast,
            <Alert
              type="success"
              title={`${PATIENT_TERM_CAP} Record Created`}
              body="New information record has been created."
            />
          );
          setSubmitted(true);
        },
        (error) => {
          appInsights.trackException(error);
          showError(
            toast,
            `${PATIENT_TERM_CAP} Data Error`,
            "Please check for missing data or typos."
          );
        }
      );
    }
  };
  // after the submit was success, redirect back to the List page
  if (submitted) {
    return <Redirect to={`/patients/?facility=${props.activeFacilityId}`} />;
  }
  //TODO: when to save initial data? What if name isn't filled? required fields?
  return (
    <main className="prime-edit-patient prime-home">
      <Prompt
        when={formChanged}
        message={(location) =>
          "\nYour changes are not yet saved!\n\nClick OK discard changes, Cancel to continue editing."
        }
      />
      <Breadcrumbs
        crumbs={[
          {
            link: `/patients/?facility=${props.activeFacilityId}`,
            text: PATIENT_TERM_PLURAL_CAP,
          },
          {
            link: "",
            text: !props.patientId
              ? `Create New ${PATIENT_TERM_CAP}`
              : fullName,
          },
        ]}
      />
      <div className="prime-edit-patient-heading">
        <div>
          <h1>
            {!props.patientId ? `Create New ${PATIENT_TERM_CAP}` : fullName}
          </h1>
          <RequiredMessage />
        </div>
        <button
          className="usa-button prime-save-patient-changes"
          disabled={!formChanged}
          onClick={savePatientData}
        >
          Save Changes
        </button>
      </div>
      <FormGroup title="General info">
        <div className="prime-form-line">
          <TextInput
            label="First Name"
            name="firstName"
            value={patient.firstName}
            onChange={onChange}
            required
          />
          <TextInput
            label="Middle Name (optional)"
            name="middleName"
            value={patient.middleName}
            onChange={onChange}
          />
          <TextInput
            label="Last Name"
            name="lastName"
            value={patient.lastName}
            onChange={onChange}
            required
          />
        </div>
        <div className="prime-form-line">
          <Dropdown
            label="Role (optional)"
            name="role"
            selectedValue={patient.role}
            onChange={onChange}
            options={[
              { label: "-Select-", value: "" },
              { label: "Staff", value: "STAFF" },
              { label: "Resident", value: "RESIDENT" },
              { label: "Student", value: "STUDENT" },
              { label: "Visitor", value: "VISITOR" },
            ]}
          />
          <Dropdown
            label="Facility"
            name="currentFacilityId"
            selectedValue={currentFacilityId}
            onChange={(e) => {
              setCurrentFacilityId(e.target.value);
              setFormChanged(true);
            }}
            options={facilityList}
            required
          />
        </div>
        <div className="prime-form-line">
          <TextInput
            type="date"
            label="Date of Birth (mm/dd/yyyy)"
            name="birthDate"
            value={patient.birthDate}
            onChange={onChange}
            required
          />
        </div>
      </FormGroup>
      <FormGroup title="Contact Information">
        <div className="prime-form-line">
          <TextInput
            type="tel"
            label="Phone Number"
            name="telephone"
            value={patient.telephone}
            className="sr-width-md"
            onChange={onChange}
            required
          />
          <TextInput
            type="email"
            label="Email Address"
            name="email"
            value={patient.email}
            className="sr-width-lg"
            onChange={onChange}
          />
        </div>
        <div className="prime-form-line">
          <TextInput
            label="Street address 1"
            name="street"
            value={patient.street}
            className="sr-width-xl"
            onChange={onChange}
            required
          />
        </div>
        <div className="prime-form-line">
          <TextInput
            label="Street address 2"
            name="streetTwo"
            value={patient.streetTwo}
            className="sr-width-xl"
            onChange={onChange}
          />
        </div>
        <div className="prime-form-line">
          <TextInput
            label="City"
            name="city"
            value={patient.city}
            className="sr-width-md"
            onChange={onChange}
          />
          <TextInput
            label="County"
            name="county"
            value={patient.county}
            className="sr-width-md"
            onChange={onChange}
          />
          <Dropdown
            label="State"
            name="state"
            selectedValue={patient.state}
            options={stateCodes.map((c) => ({ label: c, value: c }))}
            defaultSelect
            className="sr-width-sm"
            onChange={onChange}
            required
          />
          <TextInput
            label="Zip"
            name="zipCode"
            value={patient.zipCode}
            className="sr-width-sm"
            onChange={onChange}
            required
          />
        </div>
      </FormGroup>
      <FormGroup title="Demographics">
        <RadioGroup
          legend="Race"
          name="race"
          buttons={RACE_VALUES}
          selectedRadio={patient.race}
          onChange={onChange}
        />
        <RadioGroup
          legend="Ethnicity"
          name="ethnicity"
          buttons={ETHNICITY_VALUES}
          selectedRadio={patient.ethnicity}
          onChange={onChange}
        />
        <RadioGroup
          legend="Biological Sex"
          name="gender"
          buttons={GENDER_VALUES}
          selectedRadio={patient.gender}
          onChange={onChange}
        />
      </FormGroup>
      <FormGroup title="Other">
        <RadioGroup
          legend="Resident in congregate care/living setting?"
          name="residentCongregateSetting"
          buttons={[
            { label: "Yes", value: "YES" },
            { label: "No", value: "NO" },
          ]}
          selectedRadio={patient.residentCongregateSetting}
          onChange={onChange}
          required
        />
        <RadioGroup
          legend="Work in Healthcare?"
          name="employedInHealthcare"
          buttons={[
            { label: "Yes", value: "YES" },
            { label: "No", value: "NO" },
          ]}
          selectedRadio={patient.employedInHealthcare}
          onChange={onChange}
          required
        />
      </FormGroup>
      {patient.testResults && (
        <FormGroup title="Test History">
          {patient.testResults.length !== 0 && (
            <table className="usa-table usa-table--borderless">
              <thead>
                <tr>
                  <th scope="col">Date of Test</th>
                  <th scope="col">Result</th>
                </tr>
              </thead>
              <tbody>
                {patient.testResults.map((r: any, i: number) => (
                  <tr key={i}>
                    <td>{moment(r.dateTested).format("lll")}</td>
                    <td>{r.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </FormGroup>
      )}
      <div className="prime-edit-patient-heading">
        <div></div>
        <button
          className="usa-button prime-save-patient-changes"
          disabled={!formChanged}
          onClick={savePatientData}
        >
          Save Changes
        </button>
      </div>
    </main>
  );
};

export default PatientForm;
