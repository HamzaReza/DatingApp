import createStyles from "@/app/authStyles/profession.styles";
import RnButton from "@/components/RnButton";
import RnProgressBar from "@/components/RnProgressBar";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ProfessionValues } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { Pressable, View } from "react-native";
import * as Yup from "yup";

const professionSchema = Yup.object().shape({
  profession: Yup.string()
    .oneOf(
      ["it", "healthcare", "engineer", "business", "teacher", "artist"],
      "Please select a valid option"
    )
    .required("Please select an option"),
});

const PROFESSIONS = [
  { value: "it", label: "IT & Software" },
  { value: "healthcare", label: "Doctor / Healthcare" },
  { value: "engineer", label: "Engineer" },
  { value: "business", label: "Business Owner" },
  { value: "teacher", label: "Teacher / Professor" },
  { value: "artist", label: "Artist / Designer" },
] as const;

export default function Profession() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const params = useLocalSearchParams();

  const handleProfessionSubmit = async (values: ProfessionValues) => {
    if (!values.profession) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push({
        pathname: "/religion",
        params: { ...params, profession: values.profession },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOption = (
    option: (typeof PROFESSIONS)[number],
    selectedOption: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const isSelected = selectedOption === option.value;
    return (
      <Pressable
        key={option.value}
        onPress={() =>
          setFieldValue("profession", isSelected ? "" : option.value)
        }
        style={[styles.option, isSelected && styles.optionSelected]}
      >
        <RnText
          style={[styles.optionText, isSelected && styles.optionTextSelected]}
        >
          {option.label}
        </RnText>
      </Pressable>
    );
  };

  return (
    <ScrollContainer topBar={<RnProgressBar progress={10 / 11} />}>
      <Formik
        initialValues={{ profession: "" }}
        validationSchema={professionSchema}
        onSubmit={handleProfessionSubmit}
      >
        {({ values, setFieldValue, handleSubmit, errors }) => (
          <View style={styles.innerContainer}>
            <RnText style={styles.title}>What Is Your Profession?</RnText>
            <RnText style={styles.subtitle}>
              Let others know what you do for a living
            </RnText>

            <View style={styles.optionsContainer}>
              {PROFESSIONS.map((option) =>
                renderOption(option, values.profession, setFieldValue)
              )}
            </View>

            {errors.profession && (
              <RnText style={styles.errorText}>{errors.profession}</RnText>
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
