import axios from "axios";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import DataGrid from "../../../components/DataGrid";
import Footer from "../../../components/Footer";
import Title from "../../../components/Title";

export default function CustomerDetailsPage({
  customer,
  trainings: allTrainings,
}) {
  const router = useRouter();
  const { customer: id } = router.query;

  const [removingTraining, setRemovingTraining] = useState("");

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showRemoveTrainingModal, setShowRemoveTrainingModal] = useState(false);

  const handleHideRemoveModal = () => {
    setShowRemoveModal(false);
  };

  const handleHideRemoveTrainingModal = () => {
    setShowRemoveTrainingModal(false);
  };

  const removeCustomer = async () => {
    await axios.delete(
      `https://customerrest.herokuapp.com/api/customers/${id}`
    );
    router.push("/customers");
    toast.success("Asiakas poistettu onnistuneesti!");
  };

  const removeTraining = async () => {
    await axios.delete(
      `https://customerrest.herokuapp.com/api/trainings/${removingTraining}`
    );
    router.reload();
    toast.success("Ajanvaraus poistettu onnistuneesti!");
  };

  // Check if trainings actually exist in the response as it returns data even if there is no trainings
  const trainings =
    allTrainings.content[0].rel === null ? [] : allTrainings.content;

  return (
    <div className="container-fluid">
      <Title
        pageName={`${customer.firstname} ${customer.lastname} | Asiakkaat`}
      />

      <Modal
        autoFocus={false}
        show={showRemoveModal}
        onHide={handleHideRemoveModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Poista asiakas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Oletko varma, että haluat poistaa tämän asiakkaan?</p>
          <div className="float-right">
            <a
              href="#"
              className="btn btn-danger mr-1"
              onClick={handleHideRemoveModal}
            >
              Peruuta
            </a>
            <a href="#" className="btn btn-success" onClick={removeCustomer}>
              Vahvista
            </a>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        autoFocus={false}
        show={showRemoveTrainingModal}
        onHide={handleHideRemoveTrainingModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Poista ajanvaraus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Oletko varma, että haluat poistaa tämän ajanvarauksen?</p>
          <div className="float-right">
            <a
              href="#"
              className="btn btn-danger mr-1"
              onClick={handleHideRemoveTrainingModal}
            >
              Peruuta
            </a>
            <a href="#" className="btn btn-success" onClick={removeTraining}>
              Vahvista
            </a>
          </div>
        </Modal.Body>
      </Modal>

      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/customers" passHref>
              <a>Asiakkaat</a>
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {customer.firstname} {customer.lastname}
          </li>
        </ol>
      </nav>
      <main role="main" className="container-flex">
        <div className="row">
          <aside className="col-md-5">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">
                  {customer.firstname} {customer.lastname}
                  <a
                    className="card-tool"
                    href="#"
                    onClick={() => setShowRemoveModal(true)}
                  >
                    Poista
                  </a>
                  <Link href={`/customers/${id}/edit`} passHref>
                    <a className="card-tool">Muokkaa</a>
                  </Link>
                </h4>

                <div className="form-group">
                  <label>Sähköposti</label>
                  <p>{customer.email}</p>
                </div>

                <div className="form-group">
                  <label>Puhelinnumero</label>
                  <p>{customer.phone}</p>
                </div>

                <div className="form-group">
                  <label>Osoite</label>
                  <p>
                    {customer.streetaddress}, {customer.postcode}{" "}
                    {customer.city}
                  </p>
                </div>
              </div>
            </div>
          </aside>
          <div className="col-md-7">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">
                  Ajanvaraukset
                  <Link href={`/customers/${id}/training`} passHref>
                    <a className="card-tool">Uusi</a>
                  </Link>
                </h4>
                {trainings.length > 0 ? (
                  <DataGrid
                    identifier="date"
                    columns={[
                      {
                        label: "Päiväys",
                        name: "date",
                        width: "30%",
                        render: (d) => {
                          return dayjs(d.date).format("DD.MM.YYYY HH:mm");
                        },
                      },
                      { label: "Tyyppi", name: "activity", width: "50%" },
                      {
                        label: "Kesto",
                        name: "duration",
                        render: (d) => {
                          return `${d.duration} min`;
                        },
                      },
                      {
                        label: "Toiminnot",
                        name: "actions",
                        render: (d) => {
                          return (
                            <a
                              href="#"
                              onClick={() => {
                                setRemovingTraining(
                                  d.links[0].href.split("/").at(-1)
                                );
                                setShowRemoveTrainingModal(true);
                              }}
                            >
                              Poista
                            </a>
                          );
                        },
                      },
                    ]}
                    data={trainings}
                  />
                ) : (
                  <p>Asiakkaalla ei ole ajanvarauksia.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const customer = await axios({
    method: "get",
    url: `https://customerrest.herokuapp.com/api/customers/${query.customer}`,
  });

  if (!customer.data) {
    return { props: {} };
  }

  const trainings = await axios({
    method: "get",
    url: customer.data.links.find((element) => element.rel === "trainings")
      .href,
  });

  return {
    props: { customer: customer.data, trainings: trainings.data },
  };
};
