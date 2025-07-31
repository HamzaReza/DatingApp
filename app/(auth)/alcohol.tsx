import createStyles from "@/app/authStyles/alcohol.styles";
import RnButton from "@/components/RnButton";
import RnProgressBar from "@/components/RnProgressBar";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AlcoholValues } from "@/types";
import { hp, wp } from "@/utils";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import * as Yup from "yup";

const alcoholSchema = Yup.object().shape({
  alcohol: Yup.string().required("Please select your alcohol preference"),
});

const alcoholOptions = [
  { value: "drink", label: "Drink alcohol" },
  { value: "dont_drink", label: "Don't drink" },
  { value: "occasionally", label: "Occasionally" },
  { value: "socially", label: "Socially" },
];

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
    item: { value: string; label: string },
    selectedOption: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const isSelected = selectedOption === item.value;
    return (
      <Pressable
        onPress={() => setFieldValue("alcohol", isSelected ? "" : item.value)}
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
              <FlatList
                data={alcoholOptions}
                renderItem={({ item }) =>
                  renderOption(item, values.alcohol, setFieldValue)
                }
                keyExtractor={item => item.value}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                ItemSeparatorComponent={() => (
                  <View style={{ height: hp(2) }} />
                )}
              />
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
    </ScrollContainer>
  );
}
