import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Play, Pause, RotateCcw } from 'lucide-react-native';
import { usePomodoro } from '@/contexts/PomodoroContext';

export function TimerControls() {
  const { isRunning, startTimer, pauseTimer, resetTimer, currentTask } = usePomodoro();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={resetTimer}
        testID="reset-button"
      >
        <RotateCcw color="#B0B8C4" size={24} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          styles.primaryButton,
          !currentTask && styles.disabledButton,
        ]}
        onPress={isRunning ? pauseTimer : startTimer}
        disabled={!currentTask}
        testID="play-pause-button"
      >
        {isRunning ? (
          <Pause color="#0A0E1A" size={32} />
        ) : (
          <Play color="#0A0E1A" size={32} />
        )}
      </TouchableOpacity>

      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButton: {
    width: 80,
    height: 80,
    backgroundColor: '#00D4FF',
  },
  secondaryButton: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  disabledButton: {
    backgroundColor: 'rgba(0, 212, 255, 0.3)',
  },
  placeholder: {
    width: 60,
    height: 60,
  },
});