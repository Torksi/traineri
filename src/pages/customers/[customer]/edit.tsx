import axios from "axios";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import Footer from "../../../components/Footer";
import InputGroup from "../../../components/InputGroup";
import Title from "../../../components/Title";

export default function EditCustomer({ customer }) {
  const router = useRouter();

  const customerId = customer.links[0].href.split("/").at(-1);

  const [firstName, setFirstName] = useState(customer.firstname);
  const [lastName, setLastName] = useState(customer.lastname);
  const [phoneNumber, setPhoneNumber] = useState(customer.phone);
  const [email, setEmail] = useState(customer.email);
  const [address, setAddress] = useState(customer.streetaddress);
  const [city, setCity] = useState(customer.city);
  const [postalCode, setPostalCode] = useState(customer.postcode);
  const [errors, setErrors] = useState<any>({});

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await axios.put(
        `https://customerrest.herokuapp.com/api/customers/${customerId}`,
        {
          firstname: firstName,
          lastname: lastName,
          phone: phoneNumber,
          email,
          streetaddress: address,
          postcode: postalCode,
          city,
        }
      );

      router.push(`/customers/${customerId}`);
      toast.success("Asiakasta muokattu onnistuneesti!");
    } catch (err) {
      setErrors(err.response.data);
    }
  };

  return (
    <div className="container-fluid">
      <Title pageName="Muokkaa asiakasta" />
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/customers" passHref>
              <a>Asiakkaat</a>
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Muokkaa asiakasta
          </li>
        </ol>
      </nav>

      <main role="main">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Muokkaa asiakasta</h4>
                <form onSubmit={submitForm}>
                  <div className="form-row">
                    <InputGroup
                      value={firstName}
                      setValue={setFirstName}
                      name="firstName"
                      type="text"
                      className="form-group col-md-3"
                      labelText="Etunimi"
                      error={errors.firstName}
                      required
                    />
                    <InputGroup
                      value={lastName}
                      setValue={setLastName}
                      name="lastName"
                      type="text"
                      className="form-group col-md-3"
                      labelText="Sukunimi"
                      error={errors.lastName}
                      required
                    />
                    <InputGroup
                      value={phoneNumber}
                      setValue={setPhoneNumber}
                      name="phoneNumber"
                      type="text"
                      className="form-group col-md-3"
                      labelText="Puhelinnumero"
                      error={errors.phoneNumber}
                      required
                    />
                    <InputGroup
                      value={email}
                      setValue={setEmail}
                      name="email"
                      type="email"
                      required
                      className="form-group col-md-3"
                      labelText="Sähköposti"
                      error={errors.email}
                    />
                  </div>
                  <div className="form-row">
                    <InputGroup
                      value={address}
                      setValue={setAddress}
                      name="address"
                      type="text"
                      required
                      className="form-group col-md-7"
                      labelText="Osoite"
                      error={errors.address}
                    />
                    <InputGroup
                      value={postalCode}
                      setValue={setPostalCode}
                      name="postalCode"
                      type="text"
                      required
                      className="form-group col-md-2"
                      labelText="Postinumero"
                      error={errors.postalCode}
                    />
                    <InputGroup
                      value={city}
                      setValue={setCity}
                      name="city"
                      type="text"
                      required
                      className="form-group col-md-3"
                      labelText="Kaupunki"
                      error={errors.city}
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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const customer = await axios({
    method: "get",
    url: `https://customerrest.herokuapp.com/api/customers/${query.customer}`,
  });

  if (!customer.data) {
    return { props: {} };
  }

  return {
    props: { customer: customer.data },
  };
};
