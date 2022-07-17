import { render } from "@testing-library/react";
import App from "./App";

test("renders landing doit button", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/¡Do It!/i);
  expect(linkElement).toBeInTheDocument();
});
