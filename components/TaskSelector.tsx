import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { TaskList } from './TaskList';
import { usePomodoro } from '@/contexts/PomodoroContext';

export function TaskSelector() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { tasks } = usePomodoro();

  const activeTasks = tasks.filter(task => !task.isCompleted);

  return (
    <>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setIsModalVisible(true)}
        testID="task-selector"
      >
        <Text style={styles.selectorText}>
          {activeTasks.length > 0 ? 'Select Task' : 'No Tasks Available'}
        </Text>
        <ChevronDown color="#B0B8C4" size={20} />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TaskList
          onClose={() => setIsModalVisible(false)}
          selectionMode={true}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectorText: {
    fontSize: 16,
    color: '#B0B8C4',
    fontWeight: '500',
  },
});