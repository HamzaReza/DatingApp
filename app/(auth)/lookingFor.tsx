import createStyles from "@/app/authStyles/lookingFor.styles";
import RnButton from "@/components/RnButton";
import RnProgressBar from "@/components/RnProgressBar";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LookingForValues } from "@/types";
import { wp } from "@/utils";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { Pressable, View } from "react-native";
import * as Yup from "yup";

const lookingForSchema = Yup.object().shape({
  lookingFor: Yup.string()
    .oneOf(
      ["relationship", "casual", "notSure", "marriage"],
      "Please select a valid option"
    )
    .required("Please select an option"),
});

export default function LookingFor() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const params = useLocalSearchParams();

  const handleLookingForSubmit = async (values: {
    lookingFor: LookingForValues["lookingFor"] | "";
  }) => {
    if (!values.lookingFor) return;
    setIsLoading(true);
    try {
      router.push({
        pathname: "/interests",
        params: { ...params, lookingFor: values.lookingFor },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOption = (
    value: LookingForValues["lookingFor"],
    label: string,
    selectedOption: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const isSelected = selectedOption === value;
    return (
      <Pressable
        onPress={() => setFieldValue("lookingFor", isSelected ? "" : value)}
        style={[styles.option, isSelected && styles.optionSelected]}
      >
        <RnText
          style={[styles.optionText, isSelected && styles.optionTextSelected]}
        >
          {label}
        </RnText>
      </Pressable>
    );
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
          <RnProgressBar progress={8 / 12} />
        </View>
      }
    >
      <Formik
        initialValues={{ lookingFor: "" }}
        validationSchema={lookingForSchema}
        onSubmit={handleLookingForSubmit}
      >
        {({ values, setFieldValue, handleSubmit, errors }) => (
          <View style={styles.innerContainer}>
            <RnText style={styles.title}>I Am Looking For...</RnText>
            <RnText style={styles.subtitle}>
              Provide us with further insights into your preferences
            </RnText>

            <View style={styles.optionsContainer}>
              {renderOption(
                "relationship",
                "A relationship",
                values.lookingFor,
                setFieldValue
              )}
              {renderOption(
                "casual",
                "Something casual",
                values.lookingFor,
                setFieldValue
              )}
              {renderOption(
                "notSure",
                "I'm not sure yet",
                values.lookingFor,
                setFieldValue
              )}
              {renderOption(
                "marriage",
                "Marriage",
                values.lookingFor,
                setFieldValue
              )}
            </View>

            {errors.lookingFor && (
              <RnText style={styles.errorText}>{errors.lookingFor}</RnText>
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
