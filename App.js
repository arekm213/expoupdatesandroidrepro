/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import * as Updates from 'expo-updates';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

// Regular fetch function
const getFishSpecies = async () => {
  try {
    const response = await fetch('https://www.fishwatch.gov/api/species');
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

const App = () => {
  const [wasOTAUpdated, setWasOTAUpdated] = useState(false);

  useEffect(() => {
    const update = async () => {
      let timeForUpdatePassed = false;
      console.log('EXPO-UPDATE START');
      setTimeout(() => {
        console.log('EXPO-UPDATE TIMEOUT PASSED');
        timeForUpdatePassed = true;
        setWasOTAUpdated(true);
      }, 10000);

      try {
        console.log('EXPO-UPDATE BEFORE CHECK FOR UPDATE');
        // To test what happens with regular fetch - remove comment from two lines below and comment 'const {isAvailable} = await Updates.checkForUpdateAsync();' line
        // const res = await getFishSpecies();
        // const isAvailable = !!res;
        const {isAvailable} = await Updates.checkForUpdateAsync();
        if (isAvailable && !timeForUpdatePassed) {
          console.log('EXPO-UPDATE BEFORE FETCH UPDATE');
          const {isNew} = await Updates.fetchUpdateAsync();
          if (isNew && !timeForUpdatePassed) {
            console.log('EXPO-UPDATE BEFORE RELOAD ASYNC');
            await Updates.reloadAsync();
          }
        } else {
          console.log('EXPO-UPDATE UPDATE NOT AVAILABLE');
        }
      } finally {
        console.log('EXPO-UPDATE FINALLY');
        setWasOTAUpdated(true);
      }
    };

    update();
  }, []);

  useEffect(() => {
    console.log('EXPO-UPDATE WAS OTA UPDATED USEEFFECT', wasOTAUpdated);
  }, [wasOTAUpdated]);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onLayout = () => {
    console.log('EXPO-UPDATE ONLAYOUT');
  };

  if (!wasOTAUpdated) {
    return null;
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          onLayout={onLayout}
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
