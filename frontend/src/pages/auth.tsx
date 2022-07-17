import { Link, useParams } from "react-router-dom";

import { CustomPage } from "layout";
import Logo from "assets/Logo.svg";

import { Card } from "components/atoms";
import { UserForm, LogInForm } from "components/organisms";
import { Divider } from "@mui/material";

const AuthPage = () => {
  const { action } = useParams();

  return (
    <CustomPage>
      <section className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <Card>
          <header className="flex justify-center">
            <img src={Logo} alt="Logo" />
          </header>

          <Divider className="my-3" />
          {action === "register" && <UserForm />}
          {action === "login" && <LogInForm />}
          <Divider className="my-3" />

          <span className="text-sm">
            {action === "register"
              ? "¿Ya tienes una cuenta? "
              : "¿Aún no tienes una cuenta? "}
            <Link
              className="text-primary"
              to={action === "register" ? "/auth/login" : "/auth/register"}
            >
              <strong>
                {action === "register" ? "Inicia sesión" : "Regístrate"}
              </strong>
            </Link>
          </span>
        </Card>
      </section>
    </CustomPage>
  );
};

export default AuthPage;
