import Title from "../components/Title";
import Footer from "../components/Footer";

export default function NotFoundPage() {
  return (
    <div className="container-fluid">
      <Title pageName="Sivua ei löydy" />
      <main role="main" className="container-flex">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Sivua ei löydy</h4>
                <p>Hakemaanne sivua ei löydy.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
