<img width="1125" alt="Descope + React Native" src="assets/screenshot.png" />


# Descope React Native Sample App with Native Flows

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Welcome to the **Descope React Native Sample App**, a demonstration of how to integrate Descope's powerful native flows into a React Native application. This project is bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli) and leverages the **Descope React Native SDK** to manage session authentication seamlessly.

## Features
This sample app includes:
A fully functional React Native application demonstrating multiple approaches to integrate Descope authentication:
- **Option 1: Simple Flow:** A dedicated authentication screen navigated to from the main interface. This approach provides a clear and isolated experience for user sign-in/sign-up.
- **Option 2: Modal Flow:** A modal overlay that presents the authentication interface. This method offers a focused, yet non-intrusive user experience by keeping the user within the same screen context.
- **Option 3: Inline Flow:** The authentication form is embedded directly within the current screen.

Each option showcases how to use the Descope `FlowView` component, manage sessions, and handle user transitions post-authentication — tailored to different UX preferences and app flows.

The sample app also includes guidance on integrating **Magic link Authentication** with Descope, using Android **App-Links** and iOS **Universal Links**.

## Getting Started

### Prerequisites
This sample app demonstrates setting up Descope Authentication on a **barebones React Native app**, **not using Expo**. It is designed for projects that use the native iOS and Android codebases directly, providing full control over platform-specific configuration. As such, this setup is ideal for developers who are building fully native React Native apps and need fine-grained access to Android and iOS features like App Links and Universal Links, which are not as easily configured in managed Expo environments.

You will require:
- **Node.js** and **npm** or **Yarn**
- **Android Studio** or **Xcode** (for emulators/simulators)

### Running the App

1. Clone this repository:

   ```bash
   git clone https://github.com/descope-sample-apps/react-native-sample-app.git
   cd react-native-sample-app
   ```

2. Install dependencies:

   The key libraries used in this app are: `@descope/react-native-sdk`, `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`. All dependencies are listed in the `package.json` file.

   To install the required packages, simply run:
   ```bash
   npm install
   # OR
   yarn install
   ```

3. (iOS only) Install CocoaPods:
   ```bash
   cd ios && pod install && cd ..
   # OR
   yarn ios
   ```

4. Create a `.env` file in your root directory, and copy the contents from the example file `.env.example`.
   - Change `projectId` and `baseURL` in the `.env` file to match your Descope project. You can find your Descope Project ID [here](https://app.descope.com/settings/project)
   - Change `flowId` in the `.env` file to choose your appropriate Descope Flow.
   - Select a flow navigation option (simple, or modal, or inline) by uncommenting it's `AUTH_FLOW_TYPE` field.

5. Build and run the app for iOS/Android:
   #### For iOS

   ```bash
   npx react-native run-ios
   # OR
   yarn ios
   ```

   #### For Android

   ```bash
   npx react-native run-android
   # OR
   yarn android
   ```

### Notes on Session Management and Flows

- The app uses the **`useSession` hook** for session management. Learn more in the [Descope React Native Documentation](https://docs.descope.com/build/guides/client_sdks/react-native/).

## Setup for Magic-Link Authentication
**Magic Link authentication** is a passwordless authentication method where the user receives a time-limited, secure link (usually via email). Clicking the link automatically logs them into the app. 

Descope supports Magic Links out of the box in our authentication flows. Read our [Magic Links Documentation](https://docs.descope.com/auth-methods/magic-link) to learn more, and setup Magic Links in your Descope flows.

In modern authentication, magic links are preferred, as there are no passwords to remember or steal — reduces phishing risk; and they provide a smoother UX, just one tap to log in. They are perfect for modern apps prioritizing ease of use and security.

### iOS setup:
To enable Magic Link or OAuth redirection into your iOS app (via Universal Links), follow these steps:

#### 1. Configure in XCode
Even if you’re using another editor for development (like VS Code), Xcode is required for configuring iOS App Capabilities.
- Open your project in Xcode, and select your target app from the left panel.
- Navigate to Signing & Capabilities tab.
- Ensure the following:
   - You’ve selected the correct Team.
   - Your Bundle Identifier is correct
- Click the **+Capability** button and add Associated Domains.
- Under “Domains”, add your domain in the format: `applinks:yourdomain.example.com`. <b><i>This must match exactly with the domain hosting your Apple Site Association file.</i></b>

#### 2. Deploy apple-app-site-association file
This JSON file must be deployed publicly at the exact path: `https://yourdomain.example.com/.well-known/apple-app-site-association`. (replace with your domain).

File Format:
```json
{
  "applinks": {
    "details": [
      {
        "appID": "<APPLE_TEAM_ID>.<BUNDLE_IDENTIFIER>",
        "paths": [
          "*/auth/callback",
          "/login/*"
        ]
      }
    ],
    "comment": "Matches any URL with a path that ends with /auth/callback or starts with /login/*."
  },
  "webcredentials": {
    "apps": [
      "<APPLE_TEAM_ID>.<BUNDLE_IDENTIFIER>"
    ]
  }
}
```
- `APPLE_TEAM_ID`: You can find this in your Apple Developer account.
- `BUNDLE_IDENTIFIER`: Should match your app’s bundle ID (e.g., `com.descope.TrekTribe`).

**Note**: It must be served with `Content-Type: application/json`, and must not have any file extension (i.e., not .json).

#### 3. Ensure Redirect URLs match
The links sent in Magic Link/OAuth emails must begin with: `https://yourdomain.example.com/login...` (or as per your configuration in the `apple-app-site-association` file), and your app must be configured to handle those paths via the Apple App Site Association.



### Android Setup:
To set up Android App Links in a React Native app and enable features like Magic Link or OAuth deep linking, follow these steps carefully. This will ensure that clicking a login link from email or browser will open the app automatically if installed.
Follow the steps:
1. Configure `AndroidManifest.xml`
2. Generating a Secure Release Keystore (for Production Use)
3. Generate Your App’s Signing Certificate Fingerprint
4. Deploy the `./well-known/assetlinks.json` to your domain

#### 1. Configure `AndroidManifest.xml`
In your app’s `android/app/src/main/AndroidManifest.xml`, add the following inside the <activity> block of your main launch activity:
```xml
<!-- Required for OAuth & Magic Link -->
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />

    <!-- Add entries for each valid deep link path -->
    <data android:scheme="https" android:host="yourdomain.example.com" android:pathPrefix="/auth/callback" />
    <data android:scheme="https" android:host="yourdomain.example.com" android:pathPrefix="/login" />
</intent-filter>
```
`"autoVerify=true"` triggers Android to automatically verify the link association during install, enabling true 'App Links' rather than generic deep links.

This ensures that Android knows your app can handle links like `https://yourdomain.example.com/login`.

#### 2. Generating a Secure Release Keystore (for Production Use)
To securely sign your Android app for production (e.g., before publishing to the Play Store or distributing to users), you must generate a **private release keystore**. This keystore is used to prove the identity of your app and must be <b><u>kept secure and never shared publicly</b></u>.

You can run the following command in your terminal from your project root (or a safe directory of your choice):
```bash
keytool -genkeypair \
  -v \
  -keystore android/app/keystores/your-release-key.jks \
  -alias your-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```
This will prompt you interactively for:
- Keystore password
- Distinguished Name (name, org, city, etc.)
- Key password (can be same as keystore password)

This keystore signs the app and becomes your app’s identity on users’ devices.

**Note**: 
- If you’re working at a company, they may already have standard procedures or shared signing keys. In that case, check with your team before creating one manually.
- **DO NOTs**:
   - Do NOT Commit this keystore file to version control.
   - Do NOT Share the key or passwords with others or store it unencrypted.
   - Do NOT Use the same key across multiple production apps unless required.


#### 3. Generate Your App’s Signing Certificate Fingerprint
You will need to upload an `assetlinks.json` file under the `./well-known` of your domain, for which you will require your App's Signing Certificate Fingerprint.

For public user-facing apps, **you must sign the app with a release key**, not debug.

To generate the SHA256 fingerprint of your release keystore:
```bash
# Run this from the root of your project (or wherever your keystore file is located)
keytool -list -v \
   -keystore path/to/your-release-key.jks \
   -alias your-key-alias \
   -storepass your-store-password \
   -keypass your-key-password
```
Look for the line: `SHA256: AB:CD:EF:...`. Copy that value (with colons) for use in `assetlinks.json`.
**Note**: It is safe to publish the SHA256 fingerprint publicly—it’s only used for verification, not authentication.

#### 4. Deploy the `./well-known/assetlinks.json` to your domain
Create a JSON file at this path on your domain: `https://yourdomain.example.com/.well-known/assetlinks.json`
The file format is:
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.company.MyAppPackageName", // your package name
      "sha256_cert_fingerprints": [
        "AB:CD:EF:12:34:56:78:90:..." // Your actual SHA256 fingerprint
      ]
    }
  }
]
```
This file allows your domain to delegate URL handling to your app securely.

**Additional Notes for Android App Links**:
- Use the same package_name (`applicationId`) as defined in your `android/app/build.gradle`.
- Use a real domain with HTTPS and a valid SSL certificate.
- Android does domain verification the first time the app is installed — so if you change the domain or certificate, you must reinstall the app.

## Learn More

To dive deeper, check out:

- [Descope Documentation](https://docs.descope.com/getting-started/react-native) – Guides, API references, and more.
- [React Native SDK](https://github.com/descope/descope-react-native) – Official React Native documentation.

## License

This sample app is licensed under the [MIT License](https://opensource.org/licenses/MIT).