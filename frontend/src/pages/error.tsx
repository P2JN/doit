import { Page } from "layout";

const ErrorPage = (props: { errorMessage?: string }) => {
  return (
    <Page title="Vaya, no hemos encontrado lo que buscas">
      <p>404!</p>
      <p>
        Lo sentimos, es posible que esta funcionalidad aún no esté disponible,
        pero pronto lo estará!
      </p>
      <p>
        Añade información sobre este error o falta de funcionalidad en el
        formulario por favor
      </p>
    </Page>
  );
};

export default ErrorPage;
