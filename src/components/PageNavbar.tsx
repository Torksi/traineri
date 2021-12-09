import Link from "next/link";
import { Nav, Navbar } from "react-bootstrap";

const PageNavbar: React.FC = () => {
  return (
    <>
      <Navbar
        collapseOnSelect
        bg="primary"
        variant="dark"
        expand="lg"
        className="mb-3"
      >
        <Link href="/" passHref>
          <Navbar.Brand>
            Traineri{" "}
            {process.env.NODE_ENV === "development" ? (
              <strong>Dev</strong>
            ) : null}
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Link href="/" passHref>
              <Nav.Link>Etusivu</Nav.Link>
            </Link>

            <Link href="/customers" passHref>
              <Nav.Link>Asiakkaat</Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default PageNavbar;
