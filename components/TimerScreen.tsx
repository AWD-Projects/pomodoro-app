import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { CircularTimer } from './CircularTimer';
import { TimerControls } from './TimerControls';
import { SessionInfo } from './SessionInfo';
import { TaskSelector } from './TaskSelector';
import { usePomodoro } from '@/contexts/PomodoroContext';

export function TimerScreen() {
  const { currentTask, sessionType } = usePomodoro();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Focus Time</Text>
        <SessionInfo />
      </View>

      <View style={styles.timerContainer}>
        <CircularTimer />
      </View>

      <View style={styles.controlsContainer}>
        <TimerControls />
      </View>

      <View style={styles.taskContainer}>
        {currentTask ? (
          <View style={styles.currentTaskCard}>
            <Text style={styles.currentTaskLabel}>Current Task</Text>
            <Text style={styles.currentTaskTitle}>{currentTask.title}</Text>
            <Text style={styles.currentTaskProgress}>
              {currentTask.completedPomodoros}/{currentTask.estimatedPomodoros} Pomodoros
            </Text>
          </View>
        ) : (
          <Text style={styles.noTaskText}>Select a task to begin</Text>
        )}
        <TaskSelector />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  controlsContainer: {
    marginBottom: 40,
  },
  taskContainer: {
    marginBottom: 20,
  },
  currentTaskCard: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  currentTaskLabel: {
    fontSize: 12,
    color: '#00D4FF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  currentTaskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  currentTaskProgress: {
    fontSize: 14,
    color: '#B0B8C4',
  },
  noTaskText: {
    fontSize: 16,
    color: '#B0B8C4',
    textAlign: 'center',
    marginBottom: 20,
  },
});