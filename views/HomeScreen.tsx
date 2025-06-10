import React, { useCallback } from 'react';
import { View, Text, Pressable, Alert, StyleSheet, ImageBackground } from 'react-native';
import { useDescope, useSession } from '@descope/react-native-sdk';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { session, clearSession } = useSession();
  const { logout } = useDescope();

  const handleLogout = useCallback(async () => {
    Alert.alert('Success', 'You have been logged out');
    try {
      await logout();
      await clearSession();
      navigation.navigate('Welcome');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout, clearSession]);

  return (
    <ImageBackground 
      source={require('../assets/home.png')} 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable 
            style={styles.button}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </Pressable>
        </View>
        <Text style={styles.text}>👋 Welcome,{'\n'}{session?.user?.name || session?.user?.email || 'user'}!</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: '50%',
  },
  header: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  text: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});