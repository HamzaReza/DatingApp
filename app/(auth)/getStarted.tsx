import createStyles from "@/app/authStyles/getStarted.styles";
import RnButton from "@/components/RnButton";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import { Image, TouchableOpacity, View } from "react-native";

export default function GetStarted() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);

  return (
    <Container>
      <View style={styles.innerContainer}>
        <View>
          <Image
            source={require("@/assets/images/getStarted.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <RnText style={styles.title}>
            Discover Love Where Your Story Begins.
          </RnText>
          <RnText style={styles.subtitle}>
            Join us to discover your ideal partner and ignite the sparks of
            romance in your journey.
          </RnText>
          <RnButton
            title="Login with Phone"
            icon="phone"
            style={[styles.button]}
            onPress={() => router.push("/login")}
          />
        </View>
        <View style={styles.footer}>
          <RnText>{`Don't have an account? `}</RnText>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <RnText style={styles.link}>Sign Up</RnText>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
}
