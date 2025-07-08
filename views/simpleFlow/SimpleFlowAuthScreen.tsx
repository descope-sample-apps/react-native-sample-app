import React, { useEffect, useState } from 'react';
import { FlowView, useSession } from '@descope/react-native-sdk';
import { StyleSheet, View, TouchableOpacity, Text, SafeAreaView, ActivityIndicator, Linking, Alert } from 'react-native';
import { Config } from 'react-native-config';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type SimpleFlowAuthScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function SimpleFlowAuthScreen({ navigation }: SimpleFlowAuthScreenProps) {
  const { session, manageSession } = useSession();
  const [ isFlowReady, setIsFlowReady ] = useState(false);
  const [ deepLink, setDeepLink ] = useState<string | undefined>(undefined);

  const flowUrl = `${Config.BASE_API_URL}/login/${Config.PROJECT_ID}?flow=${Config.FLOW_ID}&shadow=false`;

  useEffect(() => {
    const isValidDeepLink = (url: string) => url.startsWith(`${Config.BASE_API_URL}/login`);
  
    const handleUrl = async (event: { url: string }) => {
      if (isValidDeepLink(event.url)) {
        setDeepLink(event.url);
      } 
    };
  
    Linking.addEventListener('url', handleUrl);
  
    // Handle deep link if app was cold-launched via a valid URL
    Linking.getInitialURL().then((url) => {
      if (url && isValidDeepLink(url)) {
        setDeepLink(url);
      }
    });
  
    return () => Linking.removeAllListeners('url');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Cancel</Text>
      </TouchableOpacity>

      <FlowView
        style={styles.fill}
        flowOptions={{
          url: flowUrl,
          androidOAuthNativeProvider: 'google',
          iosOAuthNativeProvider: 'google',
        }}
        deepLink={deepLink}
        onReady={() => setIsFlowReady(true)}
        onSuccess={async (jwtResponse) => {
          try {
            await manageSession(jwtResponse);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          } catch (e) {
            console.error('Session management error:', e);
          }
        }}
        onError={(error) => {
          console.error('Authentication error:', error);
        }}
      />
      {!isFlowReady && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  fill: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cancelButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    zIndex: 1,
  },
  backText: {
    color: '#007AFF', // ios blue color
    fontSize: 18
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});