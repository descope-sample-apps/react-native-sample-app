import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { FlowView, useSession } from '@descope/react-native-sdk';
import { Config } from 'react-native-config';

type ModalFlowAuthScreenProps = {
  setShowModal: (showModal: boolean) => void;
  setLoggedIn: (isLoggingIn: boolean) => void;
};

export default function ModalFlowAuthScreen({ setShowModal, setLoggedIn }: ModalFlowAuthScreenProps) {
  const { manageSession } = useSession();
  const [isFlowReady, setIsFlowReady] = useState(false);
  const flowUrl = `${Config.BASE_API_URL}/login/${Config.PROJECT_ID}?flow=${Config.FLOW_ID}&shadow=false`;

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
          onReady={() => setIsFlowReady(true)}
          onSuccess={async (jwtResponse) => {
            try {
              await manageSession(jwtResponse);
              setLoggedIn(true); 
              setTimeout(() => {
                setShowModal(false);
              }, 200); // graceful load into <HomeScreen />
            } catch (e) {
              console.error('Session error:', e);
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