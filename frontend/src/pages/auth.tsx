import { Link, useNavigate, useParams } from "react-router-dom";

import { CustomPage } from "layout";

import Logo from "assets/Logo.svg";

import { Card } from "components/atoms";
import { UserForm, LogInForm } from "components/templates";
import { Divider } from "@mui/material";

const AuthPage = () => {
  const { action } = useParams();
  const navigate = useNavigate();

  return (
    <CustomPage>
      <section className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <Card>
          <header
            onClick={() => navigate("/landing")}
            className="flex justify-center"
          >
            <img src={Logo} alt="Logo" />
          </header>

          <Divider className="my-3" />

          {action === "register" && <UserForm />}
          {action === "login" && <LogInForm />}

          <Divider className="my-3" />

          <span className="text-xs">
            {action === "register"
              ? "¿Ya tienes una cuenta? "
              : "¿Aún no tienes una cuenta? "}
            <Link
              className="text-primary"
              to={action === "register" ? "/auth/login" : "/auth/register"}
            >
              <strong>
                {action === "register" ? "Inicia sesión" : "Registrate"}
              </strong>
            </Link>
          </span>
        </Card>
      </section>
    </CustomPage>
  );
};

export default AuthPage;
