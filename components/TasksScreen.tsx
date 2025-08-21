import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Plus } from 'lucide-react-native';
import { TaskList } from './TaskList';
import { TaskForm } from './TaskForm';
import { usePomodoro } from '@/contexts/PomodoroContext';

export function TasksScreen() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { tasks } = usePomodoro();

  const activeTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Tasks</Text>
          <Text style={styles.subtitle}>
            {activeTasks.length} active • {completedTasks.length} completed
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsFormVisible(true)}
          testID="add-task-button"
        >
          <Plus color="#0A0E1A" size={24} />
        </TouchableOpacity>
      </View>

      <TaskList />

      <Modal
        visible={isFormVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsFormVisible(false)}
      >
        <TaskForm onClose={() => setIsFormVisible(false)} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#B0B8C4',
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00D4FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00D4FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});