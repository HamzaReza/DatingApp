import createStyles from "@/app/authStyles/onboarding.styles";
import RnButton from "@/components/RnButton";
import Container from "@/components/RnContainer";
import RnText from "@/components/RnText";
import { Colors } from "@/constants/Colors";
import { signInWithGoogleFirebase } from "@/firebase/auth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { setToken, setUser } from "@/redux/slices/userSlice";
import { wp } from "@/utils";
import { doc } from "@react-native-firebase/firestore";
import { router } from "expo-router";
import { useState } from "react";
import { ImageBackground, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";


export default function Onboarding({ navigation }: any) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);
  const dispatch = useDispatch();
  const [googleLoading, setGoogleLoading] = useState(false);

  const _handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const result = await signInWithGoogleFirebase();
    if (result.success) {
      if (result.isNewUser) {
        router.push({
          pathname: "/signup",
          params: {
            email: result.user.email || "",
          },
        });
      } else {
        router.push("/main/home");
        dispatch(
          setUser({
            ...result.user,
            role: "user",
          })
        );
        dispatch(setToken(true));
      }
    } else {
      console.log("Google sign-in failed:", result.error);
    }
    setGoogleLoading(false);
  };

  const handleSendProfitForApartment = async () => {
  try {
    console.log("Starting handleSendProfit...");
    const investmentPostersId = "VrT66Kjql1FZpiKwKeG3";

    const posterRef = doc(
      db,
      "investmentPosters",
      investmentPostersId,
      "apartmentPosters",
      poster.id
    );
    const posterSnapshot = await getDoc(posterRef);
    if (!posterSnapshot.exists()) {
      alert("Poster not found.");
      return;
    }

    const posterData = posterSnapshot.data();
    const rents = posterData.rents || [];

    const currentDate = new Date();
    const currentRent = rents.find((rent) => {
      const rentStart = new Date(rent.rentStartingDate);
      const rentEnd = new Date(rent.rentEndingDate);
      return currentDate >= rentStart && currentDate <= rentEnd;
    });

    if (!currentRent) {
      alert("No active rent found for this apartment.");
      return;
    }

    const rentAmount = Number(currentRent.rentAmount);
    const profitAfterCommission = rentAmount * 0.8;
    const investers = posterData.investers || [];

    if (investers.length === 0) {
      alert("No investors found for this apartment poster.");
      return;
    }

    let totalProfitShared = 0;
    const notifications = [];

    // Process in parallel using Promise.all
    const investorChunks = [];

    // Firestore allows max 500 writes per batch
    const chunkSize = 400;
    for (let i = 0; i < investers.length; i += chunkSize) {
      investorChunks.push(investers.slice(i, i + chunkSize));
    }

    for (const chunk of investorChunks) {
      const batch = writeBatch(db);

      await Promise.all(chunk.map(async (userId) => {
        const userDoc = await getDoc(doc(db, "users", userId));
        const userData = userDoc.data();
        const playerId = userData?.playerId;

        const userInvestmentsSnapshot = await getDocs(
          collection(db, "users", userId, "apartmentInvestments")
        );

        const investmentDoc = userInvestmentsSnapshot.docs.find((doc) => {
          return doc.data().apartmentId === poster.id;
        });

        if (!investmentDoc) {
          console.warn(`No investment found for user ${userId}`);
          return;
        }

        const investmentData = investmentDoc.data();
        const investmentRef = doc(
          db,
          "users",
          userId,
          "apartmentInvestments",
          investmentDoc.id
        );

        const investmentPercentage =
          investmentData.investedAmount / posterData.totalAmount;
        const investorProfit = profitAfterCommission * investmentPercentage;

        // Update profit field using batch
        const currentProfit = investmentData.profit || 0;
        batch.update(investmentRef, {
          profit: currentProfit + investorProfit,
        });

        // Update user's cash
        const totalAssetsRef = doc(db, "users", userId, "totalAssets", "cash");
        const totalAssetsSnapshot = await getDoc(totalAssetsRef);
        const currentCash = totalAssetsSnapshot.exists()
          ? totalAssetsSnapshot.data().amount || 0
          : 0;
        batch.update(totalAssetsRef, {
          amount: currentCash + investorProfit,
        });

        totalProfitShared += investorProfit;

        if (playerId) {
          notifications.push({
            playerId,
            heading: "Profit Received for apartment Investment",
            message: `Your apartment investment profit: ₹${investorProfit.toFixed(2)}`
          });
        }
      }));

      await batch.commit(); // commit each chunk
    }

    // Add profit history to poster
    const profitShareEntry = {
      date: new Date().toISOString(),
      totalProfitShared: totalProfitShared.toFixed(2),
    };

    await updateDoc(posterRef, {
      profitShareHistory: arrayUnion(profitShareEntry),
    });

    // Send notifications
   if (notifications.length > 0) {
      const notificationResults = await Promise.all(
        notifications.map(async (notification) => {
          const result = await sendNotification(notification);
          if (result.success) {
            console.log(
              `✅ Notification sent successfully to playerId: ${notification.playerId}, userId: ${notification.userId}`
            );
          } else {
            console.error(
              `❌ Failed to send notification to playerId: ${notification.playerId}, userId: ${notification.userId}`,
              result.error
            );
          }
          return result;
        })
      );
      console.log("Notification results:", notificationResults);
    }


    alert("Profit successfully distributed to investors!");
    console.log("handleSendProfit completed successfully.");
  } catch (error) {
    console.error("Error in handleSendProfit:", error);
    alert("Error sending profit. Please try again.");
  }
};

  return (
    <Container>
      <ImageBackground
        source={require("@/assets/images/onboarding.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <RnButton
          title="Login with Google"
          icon="google"
          style={[styles.socialButton, styles.socialwhiteText]}
          onPress={_handleGoogleSignIn}
          noRightIcon
          leftIconColor={Colors[theme].redText}
          loading={googleLoading}
          loaderColor={Colors[theme].redText}
          leftIconSize={wp(6)}
        />

        <RnButton
          title="Login with Apple"
          icon="apple"
          style={[styles.socialButton, styles.socialwhiteText]}
          onPress={() => {
            dispatch(setToken(true));
            dispatch(
              setUser({
                role: "admin",
              })
            );
         
         router.push('/(tabs)/main/home')
          }}
          noRightIcon
          leftIconColor={Colors[theme].blackText}
          leftIconSize={wp(6)}
          disabled={googleLoading}
        />

        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => router.push("/getStarted")}
        >
          <RnText style={styles.emailwhiteText}>Continue with Phone</RnText>
        </TouchableOpacity>

        <View style={styles.footer}>
          <RnText style={styles.footerText}>
            By Continuing you agree to our{" "}
            <RnText
              style={styles.footerLink}
              onPress={() => {
                // Navigate to Terms
              }}
            >
              Terms
            </RnText>
            {" & "}
            <RnText
              style={styles.footerLink}
              onPress={() => {
                // Navigate to Privacy Policy
              }}
            >
              Privacy
            </RnText>
          </RnText>
        </View>
      </View>
    </Container>
  );
}
