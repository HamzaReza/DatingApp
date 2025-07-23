import createStyles from "@/app/authStyles/lookingFor.styles";
import RnBottomSheet from "@/components/RnBottomSheet";
import RnButton from "@/components/RnButton";
import RnProgressBar from "@/components/RnProgressBar";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { fetchQuestionnaires } from "@/firebase/auth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LookingForValues } from "@/types";
import { hp, wp } from "@/utils";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik, FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
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
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [scenarioQuestionnaires, setScenarioQuestionnaires] = useState<any[]>(
    []
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedScales, setSelectedScales] = useState<{
    [key: string]: number | null;
  }>({});

  const formikRef = useRef<FormikProps<any>>(null);

  useEffect(() => {
    const unsubscribe = fetchQuestionnaires(questionnaires => {
      setQuestionnaires(questionnaires);
    });
    return () => unsubscribe();
  }, []);

  const handleLookingForSubmit = async (values: {
    lookingFor: LookingForValues["lookingFor"] | "";
    profileScore: number;
  }) => {
    if (!values.lookingFor) return;
    setIsLoading(true);
    try {
      router.push({
        pathname: "/interests",
        params: {
          ...params,
          lookingFor: values.lookingFor,
          profileScore: values.profileScore,
        },
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
        onPress={() => {
          setFieldValue("lookingFor", isSelected ? "" : value);
          const keyMap = {
            relationship: "relationship",
            casual: "casual",
            notSure: "not_sure",
            marriage: "marriage",
          };
          const objectKey = keyMap[value];

          const tempQuestionnaire = questionnaires[0][objectKey] || [];

          setScenarioQuestionnaires(isSelected ? [] : tempQuestionnaire);
        }}
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

  const calculateProfileScore = (selectedScales: {
    [key: string]: number | null;
  }) => {
    const answers = Object.values(selectedScales).filter(
      (v): v is number => typeof v === "number"
    );
    if (answers.length === 0) return 0;
    const total = answers.reduce((sum, answer) => {
      const normalized = (answer - 1) / 6;
      return sum + normalized;
    }, 0);
    const score = parseFloat(
      (parseFloat((total / answers.length).toFixed(3)) * 100).toFixed(2)
    );
    setModalVisible(false);
    setTimeout(() => {
      handleLookingForSubmit({
        lookingFor: formikRef.current?.values?.lookingFor,
        profileScore: score,
      });
    }, 500);
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
        onSubmit={() => setModalVisible(true)}
        innerRef={formikRef}
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
              <RnText style={styles.errorText}>
                {errors.lookingFor as string}
              </RnText>
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
      <RnBottomSheet
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        enableDynamicSizing
      >
        <FlatList
          data={scenarioQuestionnaires}
          contentContainerStyle={{ paddingBottom: hp(10) }}
          renderItem={({ item }) => {
            const questionKey = item.id || item.question;
            const selectedScale = selectedScales[questionKey] ?? null;
            return (
              <View style={styles.questionContainer}>
                <RnText style={styles.questionText}>{item.question}</RnText>
                <View style={styles.scaleContainer}>
                  <RnText style={styles.scaleRightText}>Disagree</RnText>
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <Pressable
                      key={num}
                      onPress={() =>
                        setSelectedScales(prev => ({
                          ...prev,
                          [questionKey]: num,
                        }))
                      }
                      style={[
                        styles.scaleButton,
                        {
                          backgroundColor:
                            selectedScale === num
                              ? Colors[theme].primary
                              : "#eee",
                          borderColor:
                            selectedScale === num
                              ? Colors[theme].primary
                              : "#ccc",
                        },
                      ]}
                    >
                      <RnText
                        style={[
                          styles.scaleText,
                          {
                            color: selectedScale === num ? "#fff" : "#333",
                          },
                        ]}
                      >
                        {num}
                      </RnText>
                    </Pressable>
                  ))}
                  <RnText style={styles.scaleLeftText}>Agree</RnText>
                </View>
              </View>
            );
          }}
          ListFooterComponent={() => (
            <RnButton
              title="Continue"
              style={styles.button}
              onPress={() => {
                calculateProfileScore(selectedScales);
              }}
              disabled={isLoading}
              loading={isLoading}
            />
          )}
        />
      </RnBottomSheet>
    </ScrollContainer>
  );
}
