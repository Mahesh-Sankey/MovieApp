import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

const CustomMainPageHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{'MOVIEFIX'}</Text>
    </View>
  );
};

const AppNavigator = () => {
  return (
    <View style={styles.appContainer}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            title: 'Overview',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#242424',
            },
            headerTitleStyle: {
              fontSize: 18,
              color: '#F0283C',
            },
            headerTintColor: 'black',
          }}>
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              headerLeft: () => <></>,
              title: '',
              headerTransparent: false,
              header: () => <CustomMainPageHeader />,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  headerContainer: {
    height: 80,
    justifyContent: 'center',
    backgroundColor: '#242424',
    padding: 12,
    overflow: 'hidden',
  },
  headerText: {
    fontSize: 25,
    color: '#F0283C',
    fontFamily: 'Amaranth-Regular',
    fontWeight: '700',
  },
});

export default AppNavigator;