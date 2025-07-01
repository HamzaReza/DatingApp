import createStyles from "@/app/authStyles/religion.styles";
import RnButton from "@/components/RnButton";
import RnProgressBar from "@/components/RnProgressBar";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { setToken } from "@/redux/slices/userSlice";
import { ReligionValues } from "@/types";
import { router } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const religionSchema = Yup.object().shape({
  religion: Yup.string()
    .oneOf(
      ["hinduism", "islam", "christianity", "judaism"],
      "Please select a valid option"
    )
    .required("Please select an option"),
});

const RELIGIONS = [
  { value: "hinduism", label: "Hinduism" },
  { value: "islam", label: "Islam" },
  { value: "christianity", label: "Christianity" },
  { value: "judaism", label: "Judaism" },
] as const;

export default function Religion() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleReligionSubmit = async (values: ReligionValues) => {
    if (!values.religion) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.dismissAll();
      router.push("/main/home");
      dispatch(setToken(true));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOption = (
    option: (typeof RELIGIONS)[number],
    selectedOption: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const isSelected = selectedOption === option.value;
    return (
      <Pressable
        key={option.value}
        onPress={() =>
          setFieldValue("religion", isSelected ? "" : option.value)
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
    <ScrollContainer topBar={<RnProgressBar progress={11 / 11} />}>
      <Formik
        initialValues={{ religion: "" }}
        validationSchema={religionSchema}
        onSubmit={handleReligionSubmit}
      >
        {({ values, setFieldValue, handleSubmit, errors }) => (
          <View style={styles.innerContainer}>
            <RnText style={styles.title}>{`What's Your Religion?`}</RnText>
            <RnText style={styles.subtitle}>
              Share your faith and beliefs with others
            </RnText>

            <View style={styles.optionsContainer}>
              {RELIGIONS.map((option) =>
                renderOption(option, values.religion, setFieldValue)
              )}
            </View>

            {errors.religion && (
              <RnText style={styles.errorText}>{errors.religion}</RnText>
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
