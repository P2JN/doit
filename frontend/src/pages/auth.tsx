import { Link, useNavigate, useParams } from "react-router-dom";
import GoogleLogin from "react-google-login";

import { CustomPage } from "layout";
import { GOOGLE_CALLBACK_URL } from "services/config";

import Logo from "assets/Logo.svg";

import { Card } from "components/atoms";
import { UserForm, LogInForm } from "components/organisms";
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

          <GoogleLogin
            clientId="605126668659-326bu79q9vmltj590botg09m1kpbcles.apps.googleusercontent.com"
            buttonText="Iniciar sesión con Google"
            onSuccess={(x) => console.log(x)}
            onFailure={(y) => console.log(y)}
            cookiePolicy={"single_host_origin"}
            redirectUri={GOOGLE_CALLBACK_URL}
            className="border border-blue-100"
          />

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
