import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator, Linking } from 'react-native';
import { FlowView, useSession } from '@descope/react-native-sdk';
import { Config } from 'react-native-config';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ModalFlowAuthScreenProps = {
  setShowModal: (showModal: boolean) => void;
  navigation: NativeStackNavigationProp<any>;
};

export default function ModalFlowAuthScreen({ setShowModal, navigation }: ModalFlowAuthScreenProps) {
  const { manageSession } = useSession();
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => setShowModal(false)}>
        <Text style={styles.buttonText}>← Back</Text>
      </TouchableOpacity>
      <View style={styles.contentContainer}>
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
          onError={(e) => console.error('Auth error:', e)}
        />
        {!isFlowReady && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  backButton: {
    paddingTop: 40,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  fill: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});