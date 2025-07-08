import createStyles from "@/app/adminStyles/pricing.styles";
import RnBottomSheet from "@/components/RnBottomSheet";
import RnButton from "@/components/RnButton";
import RnContainer from "@/components/RnContainer";
import RnDropdown from "@/components/RnDropdown";
import RnInput from "@/components/RnInput";
import ScrollContainer from "@/components/RnScrollContainer";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AdminPricingPlan } from "@/types/Admin";
import { wp } from "@/utils";
import { FieldArray, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import * as Yup from "yup";
import { createPricingPlan, fetchPricingPlans } from "./adminFunctions";

// Validation schema
const PricingPlanSchema = Yup.object().shape({
  name: Yup.string().required("Plan name is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .positive("Price must be positive")
    .required("Price is required"),
  duration: Yup.string().required("Duration is required"),
  features: Yup.array()
    .of(Yup.string().required("Feature cannot be empty"))
    .min(1, "At least one feature required"),
});

const durationOptions = [
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
  { label: "Lifetime", value: "lifetime" },
];

const initialPlans: AdminPricingPlan[] = [
  {
    id: "1",
    name: "Basic",
    description: "Basic access to features",
    price: 0,
    duration: "monthly",
    features: ["Browse profiles", "Send 5 messages/day"],
  },
  {
    id: "2",
    name: "Premium",
    description: "Unlock all features",
    price: 499,
    duration: "monthly",
    features: ["Unlimited messages", "See who liked you", "Priority support"],
  },
];

export default function AdminPricingPlanScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [plans, setPlans] = useState<AdminPricingPlan[]>(initialPlans);
  const [durationOpen, setDurationOpen] = useState(false);
  const [durationItems, setDurationItems] = useState(durationOptions);

useEffect(()=>{
loadPlans()
},[])

const loadPlans = async () => {
    try {
      const fetched = await fetchPricingPlans();
      setPlans(fetched as AdminPricingPlan[]);
    } catch (error) {
      console.error("Failed to load pricing plans:", error);
    }
  };

  const renderPlanCard = ({ item: plan }: { item: AdminPricingPlan }) => (
    <View style={styles.planCardWrapper}>
      <View style={styles.planCard}>
        <RnText style={styles.planTitle}>{plan.name}</RnText>
        <RnText style={styles.planDescription}>{plan.description}</RnText>
        <View style={styles.planFeatures}>
          {plan.features.map((feature, idx) => (
            <RnText key={idx} style={styles.featureItem}>
              • {feature}
            </RnText>
          ))}
        </View>
        <View style={styles.priceContainer}>
          <RnText style={styles.priceText}>₹{plan.price}</RnText>
          <RnText style={styles.durationText}>
            {durationOptions.find((d) => d.value === plan.duration)?.label}
          </RnText>
        </View>
      </View>
    </View>
  );

  const handleCreatePlan = () => {
    setIsBottomSheetVisible(true);
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };

 const handleSubmitPlan = async (values: any, { resetForm }: any) => {
  try {
    await createPricingPlan({
      name: values.name,
      description: values.description,
      price: parseFloat(values.price),
      duration: values.duration,
      features: values.features,
    });

    const updatedPlans = await fetchPricingPlans();
    setPlans(updatedPlans as AdminPricingPlan[]);
    resetForm();
    handleCloseBottomSheet();
  } catch (error) {
    console.error("Failed to create plan:", error);
  }
};


  return (
    <RnContainer>
      <RnText style={styles.headerTitle}>Pricing Plan</RnText>
      <View>
        <FlatList
          data={plans}
          renderItem={renderPlanCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.formSeparator} />}
          snapToInterval={wp(90) + wp(1)}
          decelerationRate="fast"
          snapToAlignment="start"
        />
      </View>
      <RnButton
        title="Create a pricing plan"
        style={[styles.createBtn]}
        onPress={handleCreatePlan}
      />

      <RnBottomSheet
        isVisible={isBottomSheetVisible}
        onClose={handleCloseBottomSheet}
        enableDynamicSizing={true}
        scroll
      >
        <View style={styles.formContainer}>
          <RnText style={styles.formTitle}>Create Pricing Plan</RnText>
          <Formik
            initialValues={{
              name: "",
              description: "",
              price: "",
              duration: "",
              features: [""],
            }}
            validationSchema={PricingPlanSchema}
            onSubmit={handleSubmitPlan}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              setFieldValue,
            }) => (
              <ScrollContainer>
                <View>
                  <RnInput
                    placeholder="Enter plan name"
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    error={errors.name}
                  />
                </View>
                <View>
                  <RnInput
                    placeholder="Enter description"
                    value={values.description}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    error={errors.description}
                  />
                </View>
                <View>
                  <RnInput
                    placeholder="Enter price"
                    value={values.price}
                    onChangeText={handleChange("price")}
                    onBlur={handleBlur("price")}
                    keyboardType="numeric"
                    error={errors.price}
                  />
                </View>
                <View>
                  <RnDropdown
                    open={durationOpen}
                    items={durationItems}
                    value={values.duration}
                    setOpen={setDurationOpen}
                    setItems={setDurationItems}
                    setValue={(value) => {
                      setFieldValue("duration", value());
                    }}
                    placeholder="Select duration"
                  />
                  <RnText style={styles.formErrorText}>
                    {errors.duration}
                  </RnText>
                </View>
                <FieldArray name="features">
                  {({ push, remove }) => (
                    <View>
                      <RnText style={styles.formTitle}>Features</RnText>
                      {values.features.map((feature: string, idx: number) => (
                        <View key={idx} style={styles.featureRow}>
                          <View style={styles.featureInputContainer}>
                            <RnInput
                              placeholder={`Feature ${idx + 1}`}
                              value={feature}
                              onChangeText={handleChange(`features[${idx}]`)}
                              onBlur={handleBlur(`features[${idx}]`)}
                              error={errors.features && errors.features[idx]}
                            />
                          </View>
                          <View style={styles.featureButtonsContainer}>
                            <RnButton
                              title="-"
                              style={[
                                [
                                  styles.featureButton,
                                  { backgroundColor: Colors[theme].pink },
                                ],
                              ]}
                              onPress={() => remove(idx)}
                              disabled={values.features.length === 1}
                            />
                            {idx === values.features.length - 1 && (
                              <RnButton
                                title="+"
                                style={[
                                  [
                                    styles.featureButton,
                                    { backgroundColor: "#B3FFBA" },
                                  ],
                                ]}
                                onPress={() => push("")}
                              />
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </FieldArray>
                <RnButton
                  title="Create Plan"
                  style={[styles.modalCreateBtn]}
                  onPress={handleSubmit}
                />
              </ScrollContainer>
            )}
          </Formik>
        </View>
      </RnBottomSheet>
    </RnContainer>
  );
}
