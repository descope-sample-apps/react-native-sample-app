import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, SafeAreaView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { FlowView, useSession } from '@descope/react-native-sdk';
import { Config } from 'react-native-config';
import * as Animatable from 'react-native-animatable';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type WelcomeScreenInlineProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function WelcomeScreenInline({ navigation }: WelcomeScreenInlineProps) {
  const { session, manageSession } = useSession();
  const [ showFlow, setShowFlow] = useState(false);        // should we show the auth inline component? (i.e, Did user click sign in?)
  const [ isFlowReady, setIsFlowReady ] = useState(false); // is the pre-loaded for the flow view ready?
  const [ isFlowShown, setIsFlowShown ] = useState(false); // is the auth inline component shown currently?

  const flowUrl = `${Config.BASE_API_URL}/login/${Config.PROJECT_ID}?flow=${Config.FLOW_ID}&shadow=true`;

  useEffect(() => {
    if (session) navigation.navigate('Home');
  }, [session, navigation]);

  useEffect(() => {
    if (showFlow && isFlowReady && !isFlowShown) {
      setIsFlowShown(true);
    }
  }, [showFlow, isFlowReady, isFlowShown]);

  const flowViewComponent = (
    <FlowView
      style={styles.fill}
      flowOptions={{
        url: flowUrl,
        androidOAuthNativeProvider: 'google',
        iosOAuthNativeProvider: 'google',
      }}
      onSuccess={async (jwtResponse) => {
        try {
          await manageSession(jwtResponse);
        } catch (e) {
          console.error('Session error:', e);
        }
      }}
      onError={(e) => console.error('Auth error:', e)}
    />
  );

  // to pre-load the flow view, won't be visible
  const hiddenFlowView = !isFlowReady ? (
    <View style={styles.hiddenFlow}>
      <FlowView
        {...flowViewComponent.props}
        onReady={() => setIsFlowReady(true)}
      />
    </View>
  ) : null;

  // Loading indicator while flow is not ready
  const loadingView = showFlow && !isFlowShown ? (
    <Animatable.View animation="fadeIn" duration={500} style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={styles.loadingText}>Loading...</Text>
    </Animatable.View>
  ) : null;

  // will be used once sign in is clicked, and flow view is ready
  const visibleFlowView = showFlow && isFlowReady ? (
    <Animatable.View animation="fadeIn" style={styles.flowWrapper} onAnimationEnd={() => setIsFlowShown(true)}>
      {flowViewComponent}
    </Animatable.View>
  ) : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../../assets/trekking.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <Animatable.View 
            animation={showFlow ? "fadeOutUp" : "fadeInUp"} 
            duration={600} 
            style={[styles.textContainer, !showFlow ? styles.visible : styles.hidden]}
          >
            <Text style={styles.title}>Welcome to TrekTribe</Text>
            <Text style={styles.subtitle}>Find Treks, Buddies, and make memories</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => setShowFlow(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>

          {hiddenFlowView}
          {loadingView}
          {visibleFlowView}
          
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
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
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
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#2c3e50',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  flowContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    padding: 16,
  },
  flowWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '55%',
    padding: 0,
    backgroundColor: '#F5F6FA',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'visible',
  },
  fill: {
    flex: 1,
  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
  hiddenFlow: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
});