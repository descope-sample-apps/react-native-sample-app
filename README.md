<img width="1125" alt="Screenshot 2024-12-20 at 11 28 38 AM" src="https://github.com/user-attachments/assets/1fec5f4e-c859-41ce-a39f-fd23ef2362cb" />

# Descope React Native Sample App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Welcome to the **Descope React Native Sample App**, a demonstration of how to integrate Descope's powerful flows into a React Native application. This project is bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli) and leverages the Descope React Native SDK to manage session authentication seamlessly.

> **Note**: Running Flows with React Native will open a browser. Currently our **[Native Flows](https://docs.descope.com/mobile-sdk/native-vs-browser-flows)** are not supported with React Native. If you wish to use them, you must use our **[Swift](https://github.com/descope/swift-sdk)** or **[Kotlin](https://github.com/descope/descope-kotlin)** SDKs.

## Features

This sample app includes:

- **React Native SDK Integration**: Simplified session and flow management.
- **Auth Hosting Support**: Opens a browser and renders Descope-hosted flows, with the option to use your custom hosting.

## Getting Started

### Prerequisites

Ensure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) till the "Creating a new application" step. You'll also need:

- **Node.js** and **npm** or **Yarn**
- **Android Studio** or **Xcode** (for emulators/simulators)

### Running the App

1. Clone this repository:

   ```bash
   git clone https://github.com/your-repo/react-native-sample-app.git
   cd react-native-sample-app
   ```

2. Install dependencies:

   ```bash
   npm install
   # OR
   yarn install
   ```

3. Start the Metro bundler:

   ```bash
   npm start
   # OR
   yarn start
   ```

4. Open a new terminal and run the app:

   #### For Android

   ```bash
   npm run android
   # OR
   yarn android
   ```

   #### For iOS

   ```bash
   npm run ios
   # OR
   yarn ios
   ```

5. (Optional) Update your Descope project configuration:
   - Change `projectId` and `baseURL` in the app to match your Descope project.

### Notes on Session Management and Flows

- The app uses the **`useSession` hook** for session management. Learn more in the [Descope React Native Documentation](https://docs.descope.com/build/guides/client_sdks/react-native/).
- The authentication flow is hosted by Descope by default but can be self-hosted by modifying the flow URL to point to your own domain. Example in `Flow.tsx`:
  ```javascript
  const flowUrl = `https://auth.descope.io/${projectId}?flow=sign-up-or-in`;
  ```

## (Android Only) Setup App Links

To enable Descope flows on Android, set up **App Links** in your Android project:

1. Add deep link handling logic:

   ```javascript
   import {useFlow} from '@descope/react-native-sdk';

   const flow = useFlow();

   useEffect(() => {
     Linking.addEventListener('url', async event => {
       try {
         await flow.exchange(event.url); // Exchange the deep link for a session
       } catch (error) {
         console.error(error);
       }
     });
     return () => {
       Linking.removeAllListeners('url');
     };
   }, [flow]);
   ```

2. Update your `AndroidManifest.xml`:

   ```xml
   <activity
       android:name=".MainActivity"
       android:launchMode="singleTask"
       android:theme="@style/LaunchTheme"
       android:configChanges="keyboard|keyboardHidden|orientation|screenSize">
       <intent-filter android:autoVerify="true">
           <action android:name="android.intent.action.VIEW" />
           <category android:name="android.intent.category.DEFAULT" />
           <category android:name="android.intent.category.BROWSABLE" />
           <data android:scheme="https" android:host="your-domain.com" android:path="/auth" />
       </intent-filter>
   </activity>
   ```

3. (Optional) Add a custom scheme for unsupported browsers like Opera:
   ```xml
   <intent-filter>
       <action android:name="android.intent.action.VIEW" />
       <category android:name="android.intent.category.DEFAULT" />
       <category android:name="android.intent.category.BROWSABLE" />
       <data android:scheme="myapp" android:host="auth" />
   </intent-filter>
   ```

## (Optional) Support Magic Links

For flows using **Magic Links** (or any other authentication methods that involves "leaving" the application), add specific handling in the `Flow.tsx`:

- Extend your deep link handling logic to support `resume()`:
  ```javascript
  useEffect(() => {
    Linking.addEventListener('url', async event => {
      if (event.url.includes('magiclink')) {
        try {
          await flow.resume(event.url); // Resume the flow
        } catch (error) {
          console.error(error);
        }
      }
    });
    return () => {
      Linking.removeAllListeners('url');
    };
  }, [flow]);
  ```

## Learn More

To dive deeper, check out:

- [Descope Documentation](https://docs.descope.com/getting-started/react-native) – Guides, API references, and more.
- [React Native SDK](https://github.com/descope/descope-react-native) – Official React Native documentation.

## License

This sample app is licensed under the [MIT License](https://opensource.org/licenses/MIT).
