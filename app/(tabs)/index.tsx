import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TimerScreen } from '@/components/TimerScreen';
import { PomodoroProvider } from '@/contexts/PomodoroContext';

export default function TimerTab() {
  return (
    <PomodoroProvider>
      <LinearGradient
        colors={['#0A0E1A', '#1A1F2E']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <TimerScreen />
        </SafeAreaView>
      </LinearGradient>
    </PomodoroProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});