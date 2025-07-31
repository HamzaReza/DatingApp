import createStyles from "@/app/authStyles/height.styles";
import RnButton from "@/components/RnButton";
import RnProgressBar from "@/components/RnProgressBar";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import RnWheelPicker from "@/components/RnWheelPicker";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { HeightValues } from "@/types";
import { wp } from "@/utils";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { View } from "react-native";
import * as Yup from "yup";

const heightSchema = Yup.object().shape({
  height: Yup.string().required("Height is required"),
});

// Generate height options from 5'0" to 7'0"
const generateHeightOptions = () => {
  const options = [];
  for (let feet = 5; feet <= 7; feet++) {
    for (let inches = 0; inches < 12; inches++) {
      if (feet === 7 && inches > 0) break; // Stop at 7'0"
      options.push(`${feet}'${inches.toString().padStart(2, "0")}"`);
    }
  }
  return options;
};

const heightOptions = generateHeightOptions();

export default function Height() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const params = useLocalSearchParams();

  const handleHeightSubmit = async (values: HeightValues) => {
    setIsLoading(true);
    try {
      router.push({
        pathname: "/gender",
        params: { ...params, height: values.height },
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
          <RnProgressBar progress={7 / 15} />
        </View>
      }
    >
      <Formik
        initialValues={{ height: "5'06\"" }}
        validationSchema={heightSchema}
        onSubmit={handleHeightSubmit}
        validateOnChange
        validateOnMount={false}
      >
        {({ setFieldValue, handleSubmit, values }) => (
          <View style={styles.innerContainer}>
            <View>
              <RnText style={styles.title}>How Tall Are You?</RnText>
              <RnText style={styles.subtitle}>
                Please provide your height in feet and inches
              </RnText>
              <View style={styles.pickerContainer}>
                <RnWheelPicker
                  dataSource={heightOptions}
                  selectedIndex={heightOptions.indexOf(values.height)}
                  onValueChange={item => setFieldValue("height", item)}
                  renderItem={data => (
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
