// import { Camera } from 'expo-camera';
import createStyles from '@/app/eventScreens/styles/cardScan.styles';
import Container from '@/components/RnContainer';
import { router } from 'expo-router';
import React from 'react';
import { Text, useColorScheme, View } from 'react-native';
import CustomHeader from './components/EventHeader';

const CardScan = () => {


 const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const styles = createStyles(theme);


//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
// //   const cameraRef = useRef<Camera>(null);

//   useEffect(() => {
//     (async () => {
//     //   const { status } = await Camera.requestCameraPermissionsAsync();
//     //   setHasPermission(status === 'granted');
//     })();
//   }, []);

//   if (hasPermission === null) return <View />;
//   if (hasPermission === false)
//     return (
//       <View>
//         <Text>No access to camera</Text>
//       </View>
//     );

  return (
    <Container customStyle={styles.container}>
      <CustomHeader title="Scan Card" onBackPress={() => router.back()} />

      {/* <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={cameraRef}> */}
        <View style={styles.overlay}>
          <Text style={styles.instruction}>
            Please Hold The Card Inside The Frame To Start The Card Scanning
          </Text>

          {/* Card scan frame */}
          <View style={styles.frame}>
            {/* Add border corners */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>
      {/* </Camera> */}

      {/* Scanning Button */}
      <View style={styles.buttonContainer}>
        <View style={styles.scanButton}>
          <Text style={styles.buttonText}>Scanning</Text>
        </View>
      </View>
    </Container>
  );
};

export default CardScan;


