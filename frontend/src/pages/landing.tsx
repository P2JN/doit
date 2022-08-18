import { Link } from "react-router-dom";
import { Button, Icon } from "@mui/material";

import { CustomPage } from "layout";

import Logo from "assets/Logo.svg";
import Comunity from "assets/Comunity.svg";
import Goals from "assets/Goals.svg";
import Check from "assets/Check.svg";

const LandingPage = () => {
  const LandingSection = (props: {
    title: string;
    content: string;
    img: string;
    reverse?: boolean;
  }) => {
    return (
      <div
        className={
          "mt-20 flex flex-wrap items-center " +
          (props.reverse ? "flex-row-reverse" : "")
        }
      >
        <div className="w-full text-center sm:w-1/2 sm:px-6">
          <h3 className="text-3xl font-semibold text-primary">{props.title}</h3>
          <div className="mt-6 text-xl leading-9">{props.content}</div>
        </div>
        <div className="w-full !fill-primary p-6 !text-primary sm:w-1/2">
          <img src={props.img} alt="First feature alt text" />
        </div>
      </div>
    );
  };

  return (
    <CustomPage>
      <section className="bg-gray-100">
        <div className="mx-auto max-w-screen-lg px-3 py-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon>
                <img src={Logo} alt="React Logo" />
              </Icon>
              <span className="inline-flex items-center text-xl font-semibold text-gray-900">
                Doit
              </span>
            </div>
            <nav className="">
              <ul className="navbar flex items-center text-xl font-medium text-gray-800">
                <li>
                  <Link to="/auth/login">
                    <Button variant="outlined" color="primary">
                      <strong> Sign In</strong>
                    </Button>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="mx-auto max-w-screen-lg px-3 pt-20 pb-32">
          <header className="text-center">
            <h1 className="leading-hero whitespace-pre-line text-5xl font-bold text-gray-900">
              Si quieres conseguir algo <br />
              <strong className="text-primary">empieza a hacerlo</strong>
            </h1>
            <div className="mt-4 mb-16 text-2xl">
              Anota tus <strong className="text-primary">metas</strong> y{" "}
              <strong className="text-primary">objetivos</strong>, comienza a{" "}
              <strong className="text-primary">registrar</strong> tu{" "}
              <strong className="text-primary">progreso</strong> y obten apoyo,
              motivación y participación de la{" "}
              <strong className="text-primary">comunidad</strong>
            </div>
            <Link to="/home">
              <Button variant="outlined" size="large">
                ¡ Doit !
              </Button>
            </Link>
          </header>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-screen-lg px-3 py-16">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Haz lo que quieres hacer
            </h2>
            <div className="mt-4 text-xl md:px-20">
              Con Doit, puedes anotar aquello que quieres lograr, planificar y
              organizar tu plan para conseguirlo, registrar y visualizar tu
              progreso, participar en lo que otros también quieren conseguir,
              recibir apoyo de la comunidad, y mucho más ...
            </div>
          </div>

          <LandingSection
            title="Anota tus metas y objetivos"
            content="Anota tus objetivos, es el primer paso para llegar a conseguir algo."
            img={Goals}
          />

          <LandingSection
            title="Registra tu progreso"
            content="Registra tu progreso, te ayudará a mantener constancia y dedicación."
            img={Check}
            reverse
          />
          <LandingSection
            title="Comunidad"
            content="Recibirás apoyo, motivación y participación de la comunidad, puedes crear objetivos comunitarios de tipo challenge o cooperativo."
            img={Comunity}
          />
        </div>
      </section>
    </CustomPage>
  );
};

export default LandingPage;
