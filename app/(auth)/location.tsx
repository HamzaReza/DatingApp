/* eslint-disable react-hooks/exhaustive-deps */
import createStyles from "@/app/authStyles/location.styles";
import LocationIcon from "@/assets/svg/Location.svg";
import RnBottomSheet from "@/components/RnBottomSheet";
import RnButton from "@/components/RnButton";
import RnPhoneInput from "@/components/RnPhoneInput";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import showToaster from "@/components/RnToast";
import { addGuardianMobileNumber } from "@/firebase/auth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LocationValues } from "@/types";
import * as Location from "expo-location";
import { reverseGeocodeAsync } from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { Formik, FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import * as Yup from "yup";

const locationSchema = Yup.object().shape({
  location: Yup.mixed().required("Location access is required"),
  country: Yup.string().notRequired(),
});

export default function LocationScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const params = useLocalSearchParams();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [guardianModal, setGuardianModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuardianLoading, setIsGuardianLoading] = useState(false);

  const phoneInput = useRef<PhoneInput>(null);
  const guardianFormikRef =
    useRef<FormikProps<{ guardianPhone: string }>>(null);
  const formikRef = useRef<FormikProps<LocationValues>>(null);

  useEffect(() => {
    const getAddress = async () => {
      if (
        !formikRef?.current?.values?.location?.latitude ||
        !formikRef?.current?.values?.location?.longitude
      )
        return;
      const addressData = await reverseGeocodeAsync({
        latitude: formikRef?.current?.values?.location?.latitude,
        longitude: formikRef?.current?.values?.location?.longitude,
      });
      formikRef?.current?.setFieldValue("country", addressData[0].country);
      if (addressData[0].country === "India") {
        setGuardianModal(true);
      } else {
        router.push({
          pathname: "/profession",
          params: {
            ...params,
            country: formikRef?.current?.values?.country,
            location: JSON.stringify({
              latitude: formikRef?.current?.values?.location?.latitude,
              longitude: formikRef?.current?.values?.location?.longitude,
            }),
          },
        });
      }
    };
    getAddress();
  }, [location]);

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

  const registerGuardianNumber = async () => {
    setIsGuardianLoading(true);

    try {
      await addGuardianMobileNumber(
        guardianFormikRef.current?.values?.guardianPhone || ""
      ).then(res => {
        if (!res.success) {
          showToaster({
            message: res.error,
            type: "error",
          });
          setIsGuardianLoading(false);
          return;
        }

        // Guardian registered successfully, navigate to next screen
        setGuardianModal(false);

        setTimeout(() => {
          router.push({
            pathname: "/profession",
            params: {
              ...params,
              guardianPhone: guardianFormikRef.current?.values?.guardianPhone,
              country: formikRef?.current?.values?.country,
              location: JSON.stringify({
                latitude: formikRef?.current?.values?.location?.latitude,
                longitude: formikRef?.current?.values?.location?.longitude,
              }),
            },
          });
        }, 500);
      });
    } catch (error: any) {
      console.error(error);
      showToaster({
        message: "Failed to register guardian number",
        type: "error",
      });
    } finally {
      setIsGuardianLoading(false);
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
      setLocation(location);
      formikRef.current?.setFieldValue("location", {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
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
        initialValues={{ location: null, country: "" }}
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
      <RnBottomSheet
        isVisible={guardianModal}
        onClose={() => {
          setGuardianModal(false);
        }}
        snapPoints={["40%"]}
      >
        <Formik
          initialValues={{ guardianPhone: "" }}
          validationSchema={Yup.object().shape({
            guardianPhone: Yup.string().required("Guardian phone is required"),
          })}
          onSubmit={registerGuardianNumber}
          innerRef={guardianFormikRef}
        >
          {({ values, errors, handleChange, handleSubmit }) => (
            <>
              <RnText style={styles.subtitle}>
                {`Enter your guardian's phone number`}
              </RnText>
              <RnPhoneInput
                ref={phoneInput}
                value={values.guardianPhone}
                onChangeText={text => {
                  handleChange("guardianPhone")(text);
                }}
                error={errors.guardianPhone as string}
              />
              <RnButton
                title="Continue"
                style={[styles.button]}
                onPress={handleSubmit}
                loading={isGuardianLoading}
              />
            </>
          )}
        </Formik>
      </RnBottomSheet>
    </ScrollContainer>
  );
}
