import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { connect, useSelector } from "react-redux";

import AoEForm from "../../app/testQueue/AoEForm/AoEForm";
import { showError } from "../../app/utils";
import PatientTimeOfTestContainer from "../PatientTimeOfTestContainer";
import { PxpApi } from "../PxpApiService";
import { getPatientLinkIdFromUrl } from "../../app/utils/url";

const AoEPatientFormContainer: React.FC = () => {
  const [nextPage, setNextPage] = useState(false);
  const patient = useSelector((state) => (state as any).patient as any);
  const plid =
    useSelector((state) => (state as any).plid) || getPatientLinkIdFromUrl();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const saveCallback = async (data: any) => {
    try {
      await PxpApi.submitQuestions(plid as string, patient.birthDate, data);
      setNextPage(true);
    } catch (e: any) {
      showError("There was an error submitting your responses");
      return;
    }
  };

  if (nextPage) {
    return (
      <Navigate
        to={{
          pathname: "/pxp/success",
          search: `?plid=${plid}`,
        }}
      />
    );
  }

  return (
    <PatientTimeOfTestContainer currentPage={"symptoms"}>
      <AoEForm
        patient={patient}
        isModal={false}
        saveButtonText="Submit"
        noValidation={false}
        saveCallback={saveCallback}
      />
    </PatientTimeOfTestContainer>
  );
};

export default connect()(AoEPatientFormContainer);
