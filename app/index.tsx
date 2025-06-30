import { RootState } from "@/redux/store";
import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

export default function Index() {
  const { token } = useSelector((state: RootState) => state.user);
  const { user } = useSelector((state: RootState) => state.user);

  if (token) {
    if (user?.role === "admin") {
      return <Redirect href="/admin/dashboard" />;
    } else {
      return <Redirect href="/(tabs)/home" />;
    }
  } else {
    return <Redirect href="/auth/onboarding" />;
  }
}
