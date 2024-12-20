import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View, Image} from 'react-native';
import {useSession} from '@descope/react-native-sdk';

interface HeaderProps {
  onSignIn: () => void;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({onSignIn, onSignOut}) => {
  const {session} = useSession();

  const handleAuthAction = () => {
    if (session) {
      onSignOut();
    } else {
      onSignIn();
    }
  };

  const buttonText = session ? 'Log Out' : 'Sign In';

  return (
    <View style={styles.headerContainer}>
      <Image
        source={require('./images/descope-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <TouchableOpacity style={styles.headerButton} onPress={handleAuthAction}>
        <Text style={styles.headerButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logo: {
    height: 50,
    width: 150,
  },
  headerButton: {
    backgroundColor: '#6200ea',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
});

export default Header;
