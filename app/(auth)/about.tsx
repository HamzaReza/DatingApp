import createStyles from "@/app/authStyles/about.styles";
import RnButton from "@/components/RnButton";
import RnInput from "@/components/RnInput";
import RnProgressBar from "@/components/RnProgressBar";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AboutValues } from "@/types";
import { hp, wp } from "@/utils";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { View } from "react-native";
import * as Yup from "yup";

const aboutSchema = Yup.object().shape({
  bio: Yup.string().required("Bio is required"),
  aboutMe: Yup.string().required("About Me is required"),
});

export default function About() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const params = useLocalSearchParams();

  const handleAboutSubmit = async (values: AboutValues) => {
    setIsLoading(true);
    try {
      router.push({
        pathname: "/age",
        params: { ...params, bio: values.bio, aboutMe: values.aboutMe },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollContainer
      topBar={
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FontAwesome6
            name="house"
            size={24}
            color={Colors[theme].primary}
            style={{ marginLeft: wp(5) }}
            onPress={() => router.dismissAll()}
          />
          <RnProgressBar progress={5 / 15} />
        </View>
      }
    >
      <Formik
        initialValues={{
          bio: __DEV__ ? "Test Bio" : "",
          aboutMe: __DEV__ ? "Test About Me" : "",
        }}
        validationSchema={aboutSchema}
        onSubmit={handleAboutSubmit}
        validateOnChange
        validateOnMount={false}
      >
        {({ handleChange, handleSubmit, values, errors }) => (
          <View style={styles.innerContainer}>
            <View>
              <RnText style={styles.title}>Tell Us About Yourself</RnText>
              <RnText style={styles.subtitle}>
                Share a bit more about who you are
              </RnText>
              <RnInput
                value={values.bio}
                onChangeText={handleChange("bio")}
                error={errors.bio}
                placeholder="Enter your bio"
              />
              <RnInput
                value={values.aboutMe}
                onChangeText={handleChange("aboutMe")}
                error={errors.aboutMe}
                placeholder="Tell us more about yourself"
                maxLength={500}
                multiline
                numberOfLines={5}
                inputContainerStyle={{ height: hp(10) }}
                style={{ height: hp(10), textAlignVertical: "top" }}
              />
              <RnButton
                title="Continue"
                style={styles.button}
                onPress={handleSubmit}
                disabled={isLoading}
                loading={isLoading}
              />
            </View>
          </View>
        )}
      </Formik>
    </ScrollContainer>
  );
}
