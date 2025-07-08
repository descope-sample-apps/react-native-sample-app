import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, SafeAreaView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import ModalFlowAuthScreen from './ModalFlowAuthScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type WelcomeScreenModalProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function WelcomeScreenModal({ navigation }: WelcomeScreenModalProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/trekking.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Welcome to TrekTribe</Text>
            <Text style={styles.subtitle}>Find Treks, Buddies, and make memories</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => setShowModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
          <Modal
            visible={showModal}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setShowModal(false)}
          >
            <ModalFlowAuthScreen  
              setShowModal={setShowModal}
              navigation={navigation}
            />
          </Modal>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#2c3e50',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});