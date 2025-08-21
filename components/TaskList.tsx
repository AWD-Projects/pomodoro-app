import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { TaskCard } from './TaskCard';
import { usePomodoro } from '@/contexts/PomodoroContext';

interface TaskListProps {
  onClose?: () => void;
  selectionMode?: boolean;
}

export function TaskList({ onClose, selectionMode = false }: TaskListProps) {
  const { tasks, selectTask } = usePomodoro();

  const activeTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  const handleTaskSelect = (task: any) => {
    if (selectionMode) {
      selectTask(task);
      onClose?.();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {activeTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={selectionMode ? () => handleTaskSelect(task) : undefined}
              selectionMode={selectionMode}
            />
          ))}
        </View>
        
        {completedTasks.length > 0 && (
          <View style={styles.section}>
            {completedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={selectionMode ? () => handleTaskSelect(task) : undefined}
                selectionMode={selectionMode}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  section: {
    gap: 12,
    marginBottom: 24,
  },
});