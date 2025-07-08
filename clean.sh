#!/bin/bash
echo "Starting comprehensive clean of React Native project..."

# Clean iOS
echo "Cleaning iOS..."
cd ios
rm -rf build/
rm -rf Pods/
rm -rf ~/Library/Developer/Xcode/DerivedData/*
pod cache clean --all
pod deintegrate
pod setup
cd ..

# Clean Android
echo "Cleaning Android..."
cd android
./gradlew clean
rm -rf .gradle
rm -rf build/
rm -rf app/build/
cd ..

# Clean React Native
echo "Cleaning React Native..."
rm -rf node_modules/
rm -rf /tmp/metro-*
rm -rf /tmp/haste-*
watchman watch-del-all

# Clean npm/yarn
echo "Cleaning package manager..."
npm cache clean --force

# Reinstall dependencies
echo "Reinstalling dependencies..."
npm install

# Reinstall iOS pods
echo "Reinstalling iOS pods..."
cd ios
pod install
cd ..

echo "Completed." 