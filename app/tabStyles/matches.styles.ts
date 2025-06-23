import { Colors } from '@/constants/Colors';
import { FontSize } from '@/constants/FontSize';
import { hp, wp } from '@/utils';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
   statsContainer: {
        flexDirection: 'row',
        // justifyContent: 'center',
        // alignItems: 'center',
        marginBottom: hp(3),
        gap: wp(8),
      },
      statItem: {
        alignItems: 'center',
        
      },
      statCircle: {
        width: wp(16),
        height: wp(16),
        borderRadius: wp(8),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(1),
      },
      statNumber: {
        fontSize: FontSize.regular,
        fontWeight: 'bold',
        color: Colors.light.redText,
      
      },
      statLabel: {
        fontSize: FontSize.regular,
        color: Colors.light.greenText,
      },
      section: {
       alignItems:'center'
      },
      sectionTitle: {
        fontSize: FontSize.large,
        fontWeight: 'bold',
        color: Colors.light.greenText,
        marginBottom: hp(2),
      },
      matchesList: {
        paddingBottom: hp(2),
      },
      row: {
        justifyContent: 'center',
        paddingHorizontal: wp(2),
      },
      statTextContainers:{
        flexDirection:'row',
        gap:wp(2)
      }
})

