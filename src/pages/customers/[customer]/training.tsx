import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import Footer from "../../../components/Footer";
import InputGroup from "../../../components/InputGroup";
import Title from "../../../components/Title";

export default function NewTraining() {
  const router = useRouter();

  const { customer: customerId } = router.query;

  const [date, setDate] = useState("");
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("60");
  const [errors, setErrors] = useState<any>({});

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await axios.post("https://customerrest.herokuapp.com/api/trainings", {
        date: dayjs(date).toISOString(),
        activity,
        duration,
        customer: `https://customerrest.herokuapp.com/api/customers/${customerId}`,
      });

      router.push(`/customers/${customerId}`);
      toast.success("Harjoitus luotu onnistuneesti!");
    } catch (err) {
      setErrors(err.response.data);
    }
  };

  return (
    <div className="container-fluid">
      <Title pageName="Uusi asiakas" />
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/customers" passHref>
              <a>Asiakkaat</a>
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link href={`/customers/${customerId}`} passHref>
              <a>Asiakasprofiili</a>
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Uusi Harjoitus
          </li>
        </ol>
      </nav>

      <main role="main">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Uusi harjoitus</h4>
                <form onSubmit={submitForm}>
                  <div className="form-row">
                    <InputGroup
                      value={activity}
                      setValue={setActivity}
                      name="activity"
                      type="text"
                      className="form-group col-md-6"
                      labelText="Aktiviteetti"
                      error={errors.activity}
                      required
                    />
                    <InputGroup
                      value={duration}
                      setValue={setDuration}
                      name="duration"
                      type="number"
                      className="form-group col-md-3"
                      labelText="Kesto"
                      error={errors.duration}
                      required
                    />
                    <InputGroup
                      value={date}
                      setValue={setDate}
                      name="date"
                      type="datetime-local"
                      className="form-group col-md-3"
                      labelText="Päiväys"
                      error={errors.date}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success float-right">
                    Tallenna
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
