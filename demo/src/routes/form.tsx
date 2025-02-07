import { createFileRoute } from "@tanstack/react-router";
import { CodeToggle } from "../components/CodeToggle";
import { Form } from "../examples/Form";
import code from "../examples/Form?raw";

export const Route = createFileRoute("/form")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <CodeToggle code={code}>
      <Form />
    </CodeToggle>
  );
}
