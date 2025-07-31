import createStyles from "@/app/authStyles/smoking.styles";
import RnButton from "@/components/RnButton";
import RnProgressBar from "@/components/RnProgressBar";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SmokingValues } from "@/types";
import { wp } from "@/utils";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import * as Yup from "yup";

const smokingSchema = Yup.object().shape({
  smoking: Yup.string().required("Please select your smoking preference"),
});

const smokingOptions = [
  { value: "smoke", label: "Smoke" },
  { value: "dont_smoke", label: "Don't smoke" },
  { value: "occasionally", label: "Occasionally" },
  { value: "socially", label: "Socially" },
];

export default function Smoking() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const params = useLocalSearchParams();

  const handleSmokingSubmit = async (values: SmokingValues) => {
    if (!values.smoking) return;
    setIsLoading(true);
    try {
      router.push({
        pathname: "/interests",
        params: { ...params, smoking: values.smoking },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOption = (
    item: { value: string; label: string },
    selectedOption: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const isSelected = selectedOption === item.value;
    return (
      <Pressable
        onPress={() => setFieldValue("smoking", isSelected ? "" : item.value)}
        style={[styles.option, isSelected && styles.optionSelected]}
      >
        <RnText
          style={[styles.optionText, isSelected && styles.optionTextSelected]}
        >
          {item.label}
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
          <RnProgressBar progress={11 / 15} />
        </View>
      }
    >
      <Formik
        initialValues={{ smoking: "" }}
        validationSchema={smokingSchema}
        onSubmit={handleSmokingSubmit}
      >
        {({ values, setFieldValue, handleSubmit, errors }) => (
          <View style={styles.innerContainer}>
            <RnText style={styles.title}>Do You Smoke?</RnText>
            <RnText style={styles.subtitle}>
              This helps us match you with compatible people
            </RnText>

            <View style={styles.optionsContainer}>
              <FlatList
                data={smokingOptions}
                renderItem={({ item }) =>
                  renderOption(item, values.smoking, setFieldValue)
                }
                keyExtractor={item => item.value}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{ justifyContent: "space-between" }}
              />
            </View>

            {errors.smoking && (
              <RnText style={styles.errorText}>{errors.smoking}</RnText>
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
    </ScrollContainer>
  );
}
