import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePomodoro } from '@/contexts/PomodoroContext';

export function SessionInfo() {
  const { currentSession, totalSessions, sessionType } = usePomodoro();

  if (sessionType !== 'work') {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sessionText}>
        Session {currentSession} of {totalSessions}
      </Text>
      <View style={styles.dotsContainer}>
        {Array.from({ length: totalSessions }, (_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index < currentSession ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  sessionText: {
    fontSize: 14,
    color: '#B0B8C4',
    marginBottom: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#00D4FF',
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});