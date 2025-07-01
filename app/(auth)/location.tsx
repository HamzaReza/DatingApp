import createStyles from "@/app/authStyles/location.styles";
import LocationIcon from "@/assets/svg/Location.svg";
import RnButton from "@/components/RnButton";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LocationValues } from "@/types";
import * as Location from "expo-location";
import { router } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { View } from "react-native";
import * as Yup from "yup";

const locationSchema = Yup.object().shape({
  location: Yup.mixed().required("Location access is required"),
});

export default function LocationScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSubmit = async (values: LocationValues) => {
    if (!values.location) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // router.push("/(tabs)");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationAccess = async (
    setFieldValue: (field: string, value: any) => void
  ) => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setFieldValue("location", {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      router.push("/profession");
    } catch (error) {
      console.error(error);
      alert("Error getting location");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualLocation = () => {
    // router.push("/auth/interests");
  };

  return (
    <ScrollContainer>
      <Formik
        initialValues={{ location: null }}
        validationSchema={locationSchema}
        onSubmit={handleLocationSubmit}
      >
        {({ values, setFieldValue, handleSubmit, errors }) => (
          <View style={styles.innerContainer}>
            <LocationIcon style={styles.locationIcon} />
            <RnText style={styles.title}>Enable Your Location</RnText>
            <RnText style={styles.subtitle}>
              Choose your location to start find people around you
            </RnText>

            <RnButton
              title="Get Location"
              style={[styles.button]}
              onPress={() => handleLocationAccess(setFieldValue)}
              disabled={isLoading}
              loading={isLoading}
            />

            <RnButton
              title="Enter Location Manually"
              style={[styles.manualButton, styles.manualButtonText]}
              onPress={handleManualLocation}
              disabled={isLoading}
            />

            {errors.location && (
              <RnText style={styles.errorText}>{errors.location}</RnText>
            )}
          </View>
        )}
      </Formik>
    </ScrollContainer>
  );
}
