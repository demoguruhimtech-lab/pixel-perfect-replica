import { createFileRoute } from "@tanstack/react-router";
import NivikStorefront from "@/components/storefront/NivikStorefront";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <NivikStorefront />;
}

