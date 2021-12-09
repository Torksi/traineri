import Link from "next/link";
import useSWR from "swr";
import DataGrid from "../../components/DataGrid";
import Footer from "../../components/Footer";
import Title from "../../components/Title";
import { combineFields } from "../../util/virtualField";

export default function CustomersPage() {
  const { data, error } = useSWR(
    `https://customerrest.herokuapp.com/api/customers`
  );

  if (!data || error) {
    return <></>;
  }

  const { content: customers } = data;

  customers.forEach((customer) => {
    combineFields(
      customer,
      "name",
      customer.firstname,
      customer.lastname,
      "$0 $1"
    );
  });

  return (
    <div className="container-fluid">
      <Title pageName="Asiakkaat" />

      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active" aria-current="page">
            Asiakkaat
          </li>
        </ol>
      </nav>
      <main role="main">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">
                  Asiakkaat
                  <Link href="/customers/new" passHref>
                    <a className="card-tool">Uusi</a>
                  </Link>
                </h4>
                <DataGrid
                  identifier="email"
                  sort
                  search
                  primarySearchKey="name"
                  secondarySearchKey="email"
                  columns={[
                    {
                      label: "Nimi",
                      name: "name",
                      render: (d) => {
                        return (
                          <Link
                            href={`/customers/${d.links[0].href
                              .split("/")
                              .at(-1)}/`}
                          >
                            {d.name}
                          </Link>
                        );
                      },
                    },
                    { label: "Puhelinnumero", name: "phone", width: "30%" },
                    { label: "Sähköposti", name: "email" },
                    { label: "Osoite", name: "streetaddress", width: "25%" },
                    {
                      label: "Postiosoite",
                      name: "postalAddress",
                      render: (d) => {
                        return `${d.postcode} ${d.city}`;
                      },
                    },
                  ]}
                  data={customers}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
