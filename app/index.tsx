import {Redirect} from "expo-router";
import {ROUTES} from "@/constants/routes";

export default function Page() {
  return <Redirect href={ROUTES.HOME} />;
}