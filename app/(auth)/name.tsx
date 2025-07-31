import createStyles from "@/app/authStyles/name.styles";
import RnButton from "@/components/RnButton";
import RnInput from "@/components/RnInput";
import RnProgressBar from "@/components/RnProgressBar";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { NameValues } from "@/types";
import { wp } from "@/utils";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { View } from "react-native";
import * as Yup from "yup";

const nameSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

export default function Name() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const params = useLocalSearchParams();

  const handleNameSubmit = async (values: NameValues) => {
    setIsLoading(true);
    try {
      router.push({
        pathname: "/email",
        params: { ...params, name: values.name },
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
          <RnProgressBar progress={3 / 15} />
        </View>
      }
    >
      <Formik
        initialValues={{ name: __DEV__ ? "Test" : "" }}
        validationSchema={nameSchema}
        onSubmit={handleNameSubmit}
        validateOnChange
        validateOnMount={false}
      >
        {({ handleChange, handleSubmit, values, errors }) => (
          <View style={styles.innerContainer}>
            <View>
              <RnText style={styles.title}>{`What's Your Name?`}</RnText>
              <RnText style={styles.subtitle}>
                {`Let's Get to Know Each Other`}
              </RnText>
              <RnInput
                value={values.name}
                onChangeText={handleChange("name")}
                error={errors.name}
                placeholder="Enter your name"
                maxLength={40}
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
