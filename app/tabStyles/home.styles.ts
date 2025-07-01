import { Colors } from '@/constants/Colors'
import { FontSize } from '@/constants/FontSize'
import { hp, wp } from '@/utils'
import { StyleSheet } from 'react-native'

export default (theme:'dark'|'light')=>StyleSheet.create({
 titleContainer: {
    flexDirection: 'row',
    paddingVertical: hp(2),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontWeight: 'bold',
    color: Colors[theme].greenText,
    fontSize: FontSize.extraLarge,
  },
  notificationContainer: {
    position: 'relative',
    padding: wp(2),
    borderRadius: wp(6),
    borderColor: Colors[theme].greenText,
    borderWidth: 1,
  },
  notificationDot: {
    position: 'absolute',
    top: wp(1),
    right: wp(1),
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: Colors[theme].redText,
  },
  storiesContainer: {
    marginBottom: hp(2),
  },
  storiesList: {
    paddingLeft: wp(2),
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(118,202,187,0.2)',
    borderRadius: wp(5),
    marginVertical: hp(1),
    padding: wp(1.5),
  },
  tab: {
    flex: 1,
    paddingVertical: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(4),
  },
  activeTab: {
    backgroundColor: Colors[theme].background,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  tabText: {
    textAlign: 'center',
    color: Colors[theme].greenText,
    fontWeight: '700',
    // fontSize: FontSize.small,
  },
  activeTabText: {
    color: Colors[theme].redText,
    fontWeight: 'bold',
    // dont
  },
  questionsContainer: {
    alignItems: 'center',
    paddingTop: hp(2),
  },
})