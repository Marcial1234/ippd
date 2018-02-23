import {StyleSheet} from 'react-vr';

export default styles = StyleSheet.create({
  rootView: {
    layoutOrigin: [0.5, 0.5],
    position: 'absolute',
  },
  triggerContainer: {
    transform: [{rotateY: 0}, {translateZ: -3}],
  },
  triggerButton: {
    borderRadius: 0.05,
    height: 1,
    width: 1,
    backgroundColor: '#F00',
    justifyContent: 'center',
  },
  triggerText: {
    alignSelf: 'center',
    fontSize: 0.2,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  menu:{
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingLeft: 0.03,
    paddingRight: 0.03,
    transform: [{translateZ: -1}],
    position: 'absolute',
    bottom: -.55,
    right: -.75,
    flexDirection: 'row',
  },
  menuText:{
    fontSize: 0.04,
    margin: 0.01,
    padding: 0.005
  },
  menuButton:{
    margin: 0.01,
    backgroundColor: '#2fa504',
    justifyContent: 'center',
  },
  tooltipList:{
    padding: 0.02,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    transform: [{translateZ: -1}],
    position: 'absolute',
    flexDirection: 'column',
    bottom: -.4,
    right: -.75,
  },
  tooltipListItem:{
    backgroundColor: '#224b8e',
    fontSize: 0.04,
    margin: 0.01,
    padding: 0.005,
  },
  tooltipListItemSelected:{
    backgroundColor: '#4286f4',
    fontSize: 0.04,
    margin: 0.01,
    padding: 0.005,
  },
  tooltipListRow:{
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  tooltipListImage:{
    width: 0.06,
    height: 0.06,
    margin: 0.01,
    padding: 0.005,
  },
});
