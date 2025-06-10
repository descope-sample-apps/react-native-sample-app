import React from 'react';
import { AuthProvider } from '@descope/react-native-sdk';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Config } from 'react-native-config';
import { enableScreens } from 'react-native-screens';
import HomeScreen from './views/HomeScreen';
import WelcomeScreen from './views/simpleFlow/WelcomeScreen';
import SimpleFlowAuthScreen from './views/simpleFlow/SimpleFlowAuthScreen';
import WelcomeScreenModal from './views/modalFlow/WelcomeScreenModal';
import WelcomeScreenInline from './views/inlineFlow/WelcomeScreenInline';

enableScreens(); // to optimize screen usage

const Stack = createNativeStackNavigator(); // navigation stack

export default function App() {
  return (
    <AuthProvider projectId={Config.PROJECT_ID || 'enter-your-descope-project-id'}> 
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

function MainNavigator() {
  const flowType = Config.AUTH_FLOW_TYPE || 'simple';
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Welcome"
        component={
          flowType === 'modal'  ? WelcomeScreenModal :
          flowType === 'inline' ? WelcomeScreenInline :
                                  WelcomeScreen
        }
      />
      {flowType === 'simple' && (
        <Stack.Screen name="Auth" component={SimpleFlowAuthScreen} />
      )}
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}