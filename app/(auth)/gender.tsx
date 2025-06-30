import createStyles from "@/app/authStyles/gender.styles";
import FemaleSvg from "@/assets/svg/Female.svg";
import MaleSvg from "@/assets/svg/Male.svg";
import OtherSvg from "@/assets/svg/Other.svg";
import RnButton from "@/components/RnButton";
import RnProgressBar from "@/components/RnProgressBar";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GenderValues } from "@/types";
import { router } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { Pressable, View } from "react-native";
import * as Yup from "yup";

// Validation schema
const genderSchema = Yup.object().shape({
  gender: Yup.string()
    .oneOf(["male", "female", "other"], "Please select a valid gender")
    .required("Gender is required"),
});

export default function Gender() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenderSubmit = async (values: {
    gender: GenderValues["gender"] | "";
  }) => {
    if (!values.gender) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/lookingFor");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderGenderOption = (
    gender: GenderValues["gender"],
    Icon: React.FC<{ fill: string }>,
    label: string,
    selectedGender: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const isSelected = selectedGender === gender;
    return (
      <Pressable
        onPress={() => setFieldValue("gender", isSelected ? "" : gender)}
        style={[styles.genderButton, isSelected && styles.selectedGenderButton]}
      >
        <View style={styles.genderIcon}>
          <Icon
            fill={
              isSelected ? Colors[theme].whiteText : Colors[theme].blackText
            }
          />
        </View>
        <RnText
          style={[styles.genderText, isSelected && styles.selectedGenderText]}
        >
          {label}
        </RnText>
      </Pressable>
    );
  };

  return (
    <ScrollContainer topBar={<RnProgressBar progress={6 / 11} />}>
      <Formik
        initialValues={{ gender: "" }}
        validationSchema={genderSchema}
        onSubmit={handleGenderSubmit}
      >
        {({ values, setFieldValue, handleSubmit, errors }) => (
          <View style={styles.innerContainer}>
            <RnText style={styles.title}>{`What's Your Gender?`}</RnText>
            <RnText style={styles.subtitle}>Tell us about your gender</RnText>

            <View style={styles.genderContainer}>
              {renderGenderOption(
                "male",
                MaleSvg,
                "Male",
                values.gender,
                setFieldValue
              )}
              {renderGenderOption(
                "female",
                FemaleSvg,
                "Female",
                values.gender,
                setFieldValue
              )}
              {renderGenderOption(
                "other",
                OtherSvg,
                "Other",
                values.gender,
                setFieldValue
              )}
            </View>

            {errors.gender && (
              <RnText style={styles.errorText}>{errors.gender}</RnText>
            )}

            <RnButton
              title="Continue"
              style={styles.button}
              onPress={handleSubmit}
              disabled={isLoading}
              loading={isLoading}
            />
          </View>
        )}
      </Formik>
    </ScrollContainer>
  );
}
