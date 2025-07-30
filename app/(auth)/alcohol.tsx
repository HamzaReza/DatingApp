import createStyles from "@/app/authStyles/alcohol.styles";
import RnButton from "@/components/RnButton";
import Container from "@/components/RnContainer";
import RnProgressBar from "@/components/RnProgressBar";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AlcoholValues } from "@/types";
import { wp } from "@/utils";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { Pressable, View } from "react-native";
import * as Yup from "yup";

const alcoholSchema = Yup.object().shape({
  alcohol: Yup.string().required("Please select your alcohol preference"),
});

export default function Alcohol() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const params = useLocalSearchParams();

  const handleAlcoholSubmit = async (values: AlcoholValues) => {
    if (!values.alcohol) return;
    setIsLoading(true);
    try {
      router.push({
        pathname: "/smoking",
        params: { ...params, alcohol: values.alcohol },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOption = (
    value: "drink" | "dont_drink" | "occasionally" | "socially",
    label: string,
    selectedOption: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const isSelected = selectedOption === value;
    return (
      <Pressable
        onPress={() => setFieldValue("alcohol", isSelected ? "" : value)}
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
    <Container
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
          <RnProgressBar progress={10 / 15} />
        </View>
      }
    >
      <Formik
        initialValues={{ alcohol: "" }}
        validationSchema={alcoholSchema}
        onSubmit={handleAlcoholSubmit}
      >
        {({ values, setFieldValue, handleSubmit, errors }) => (
          <View style={styles.innerContainer}>
            <RnText style={styles.title}>Do You Drink Alcohol?</RnText>
            <RnText style={styles.subtitle}>
              This helps us match you with compatible people
            </RnText>

            <View style={styles.optionsContainer}>
              {renderOption(
                "drink",
                "Drink alcohol",
                values.alcohol,
                setFieldValue
              )}
              {renderOption(
                "dont_drink",
                "Don't drink",
                values.alcohol,
                setFieldValue
              )}
              {renderOption(
                "occasionally",
                "Occasionally",
                values.alcohol,
                setFieldValue
              )}
              {renderOption(
                "socially",
                "Socially",
                values.alcohol,
                setFieldValue
              )}
            </View>

            {errors.alcohol && (
              <RnText style={styles.errorText}>{errors.alcohol}</RnText>
            )}

            <RnButton
              title="Continue"
              style={[styles.button]}
              onPress={handleSubmit}
              disabled={isLoading}
              loading={isLoading}
            />
          </View>
        )}
      </Formik>
    </Container>
  );
}
