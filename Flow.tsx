import * as React from 'react';

import {useDescope, useFlow, useSession} from '@descope/react-native-sdk';
import {useState} from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Header from './Header';
import Config from 'react-native-config';

export default function Flow() {
  const flow = useFlow();
  const descope = useDescope();
  const {session, manageSession, clearSession} = useSession();

  const [output, setOutput] = useState('');

  React.useEffect(() => {
    Linking.addEventListener('url', async event => {
      if (event.url.includes('auth/callback')) {
        // Handle magic links for both platforms
        await flow.resume(event.url);
      } else if (event.url.includes('my-authentication-redirect-deep-link')) {
        // Handle redirect deep link for Android
        await flow.exchange(event.url);
      }
    });
    return () => {
      Linking.removeAllListeners('url');
    };
  }, [flow]);

  const startFlow = async () => {
    try {
      const projectId = Config.DESCOPE_PROJECT_ID || 'your-project-id';
      const url = `https://auth.descope.io/${projectId}?flow=sign-up-or-in&shadow=false`;
      const resp = await flow.start(url, 'my-deep-link-url');
      await manageSession(resp.data);
    } catch (e: any) {
      setOutput(`${e.code}: ${e.message}`);
    }
  };

  const logOut = async () => {
    await descope.logout(session?.refreshJwt);
    await clearSession();
    setOutput('');
  };

  return (
    <SafeAreaView style={styles.appContainer}>
      {/* Header */}
      <Header onSignIn={startFlow} onSignOut={logOut} />

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {session ? (
          <>
            <Text style={styles.greetingText}>
              Welcome, {session.user.loginIds[0]}!
            </Text>
            <Text style={styles.sessionInfo}>
              Session Active:
              <Text style={styles.sessionJwt}>
                {' '}
                {session.sessionJwt.substring(0, 20)}...
              </Text>
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() =>
                Alert.alert('Action Placeholder', 'Feature coming soon.')
              }>
              <Text style={styles.primaryButtonText}>Explore Features</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Descope + React Native</Text>

            {output ? <Text style={styles.errorText}>{output}</Text> : null}

            <Text style={styles.subtitle}>
              Sign in with your own Descope Flows!
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a73e8',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#5f6368',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a73e8',
    marginBottom: 15,
    textAlign: 'center',
  },
  sessionInfo: {
    fontSize: 14,
    color: '#202124',
    marginBottom: 10,
    textAlign: 'center',
  },
  sessionJwt: {
    fontWeight: 'bold',
    color: '#34a853',
  },
  errorText: {
    fontSize: 14,
    color: '#d93025',
    marginBottom: 15,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#1a73e8',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
