import createStyles from "@/app/authStyles/age.styles";
import RnButton from "@/components/RnButton";
import RnProgressBar from "@/components/RnProgressBar";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import RnWheelPicker from "@/components/RnWheelPicker";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AgeValues } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { View } from "react-native";
import * as Yup from "yup";

const ageSchema = Yup.object().shape({
  age: Yup.number()
    .min(18, "Must be at least 18")
    .max(100, "Must be at most 100")
    .required("Age is required"),
});

const AGE_MIN = 18;
const AGE_MAX = 100;
const ageOptions = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) =>
  (AGE_MIN + i).toString()
);

export default function Age() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const params = useLocalSearchParams();

  const handleAgeSubmit = async (values: AgeValues) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push({
        pathname: "/gender",
        params: { ...params, age: values.age },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollContainer topBar={<RnProgressBar progress={5 / 11} />}>
      <Formik
        initialValues={{ age: 25 }}
        validationSchema={ageSchema}
        onSubmit={handleAgeSubmit}
        validateOnChange
        validateOnMount={false}
      >
        {({ setFieldValue, handleSubmit, values, errors }) => (
          <View style={styles.innerContainer}>
            <View>
              <RnText style={styles.title}>How Old Are You?</RnText>
              <RnText style={styles.subtitle}>
                Please provide your age in years
              </RnText>
              <View style={styles.pickerContainer}>
                <RnWheelPicker
                  dataSource={ageOptions}
                  selectedIndex={values.age - AGE_MIN}
                  onValueChange={(_, index) =>
                    setFieldValue("age", parseInt(ageOptions[index], 10))
                  }
                  renderItem={(data) => (
                    <RnText style={{ fontSize: 28, textAlign: "center" }}>
                      {data}
                    </RnText>
                  )}
                />
              </View>
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
