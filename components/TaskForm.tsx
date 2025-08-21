import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { X, Plus } from 'lucide-react-native';
import { usePomodoro, PomodoroConfig } from '@/contexts/PomodoroContext';

interface TaskFormProps {
  onClose: () => void;
}

export function TaskForm({ onClose }: TaskFormProps) {
  const { addTask } = usePomodoro();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [category, setCategory] = useState('');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState('4');

  const defaultConfig: PomodoroConfig = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (!category.trim()) {
      Alert.alert('Error', 'Please enter a category');
      return;
    }

    const pomodoros = parseInt(estimatedPomodoros) || 1;

    addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      category: category.trim(),
      estimatedPomodoros: pomodoros,
      completedPomodoros: 0,
      isCompleted: false,
      pomodoroConfig: defaultConfig,
    });

    onClose();
  };

  const priorities = [
    { value: 'high', label: 'High', color: '#FF6B35' },
    { value: 'medium', label: 'Medium', color: '#FFD23F' },
    { value: 'low', label: 'Low', color: '#39FF14' },
  ] as const;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New Task</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X color="#B0B8C4" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.field}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
            placeholderTextColor="#6B7280"
            testID="task-title-input"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter task description"
            placeholderTextColor="#6B7280"
            multiline
            numberOfLines={3}
            testID="task-description-input"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityContainer}>
            {priorities.map((p) => (
              <TouchableOpacity
                key={p.value}
                style={[
                  styles.priorityButton,
                  priority === p.value && styles.priorityButtonActive,
                  { borderColor: p.color },
                ]}
                onPress={() => setPriority(p.value)}
                testID={`priority-${p.value}`}
              >
                <View style={[styles.priorityDot, { backgroundColor: p.color }]} />
                <Text
                  style={[
                    styles.priorityText,
                    priority === p.value && styles.priorityTextActive,
                  ]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Category *</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="e.g., Work, Personal, Study"
            placeholderTextColor="#6B7280"
            testID="task-category-input"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Estimated Pomodoros</Text>
          <TextInput
            style={styles.input}
            value={estimatedPomodoros}
            onChangeText={setEstimatedPomodoros}
            placeholder="4"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
            testID="task-pomodoros-input"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          testID="submit-task-button"
        >
          <Plus color="#0A0E1A" size={20} />
          <Text style={styles.submitButtonText}>Create Task</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  priorityButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 14,
    color: '#B0B8C4',
    fontWeight: '500',
  },
  priorityTextActive: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B0B8C4',
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#00D4FF',
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A0E1A',
  },
});