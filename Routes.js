import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Home from './src/screens/Home';

const Project = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      title: 'Asteriod',
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: '#1aa260',
      },
    },
  },
});

export default createAppContainer(Project);
