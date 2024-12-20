/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';

import {AuthProvider} from '@descope/react-native-sdk';
import Flow from './Flow';
import {View} from 'react-native';
import Config from 'react-native-config';

const logger = {
  debug: (message?: any) => {
    console.log(`DEBUG: ${message}`);
  },
  log: (message?: any) => {
    console.log(`INFO: ${message}`);
  },
  warn: (message?: any) => {
    console.log(`WARN: ${message}`);
  },
  error: (message?: any) => {
    console.log(`ERROR: ${message}`);
  },
};

export default function App() {
  return (
    <AuthProvider
      projectId={Config.DESCOPE_PROJECT_ID || 'P2q3M2r3N31aGHOcwX3w6VL1Mw6y'}
      logger={logger}>
      <View style={{flex: 1, backgroundColor: '#CEEEE4'}}>
        <Flow />
      </View>
    </AuthProvider>
  );
}
