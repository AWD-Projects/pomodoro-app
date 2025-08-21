import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TasksScreen } from '@/components/TasksScreen';
import { PomodoroProvider } from '@/contexts/PomodoroContext';

export default function TasksTab() {
  return (
    <PomodoroProvider>
      <LinearGradient
        colors={['#0A0E1A', '#1A1F2E']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <TasksScreen />
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