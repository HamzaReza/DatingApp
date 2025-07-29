import createStyles from "@/app/authStyles/location.styles";
import LocationIcon from "@/assets/svg/Location.svg";
import RnButton from "@/components/RnButton";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LocationValues } from "@/types";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { Formik, FormikProps } from "formik";
import { useRef, useState } from "react";
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
  const formikRef = useRef<FormikProps<LocationValues>>(null);
  const params = useLocalSearchParams();

  const handleLocationSubmit = async (values: LocationValues) => {
    if (!values.location) return;
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationAccess = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      formikRef.current?.setFieldValue("location", {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      router.push({
        pathname: "/profession",
        params: {
          ...params,
          location: JSON.stringify({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }),
        },
      });
    } catch (error) {
      console.error(error);
      alert("Error getting location");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollContainer>
      <Formik
        initialValues={{ location: null }}
        validationSchema={locationSchema}
        onSubmit={handleLocationSubmit}
        innerRef={formikRef}
      >
        {({ errors }) => (
          <View style={styles.innerContainer}>
            <LocationIcon style={styles.locationIcon} />
            <RnText style={styles.title}>Enable Your Location</RnText>
            <RnText style={styles.subtitle}>
              Choose your location to start find people around you
            </RnText>

            <RnButton
              title="Get Location"
              style={[styles.button]}
              onPress={() => handleLocationAccess()}
              disabled={isLoading}
              loading={isLoading}
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
