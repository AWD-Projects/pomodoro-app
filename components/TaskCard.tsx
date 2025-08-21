import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, CheckCircle, Circle, MoreVertical } from 'lucide-react-native';
import { Task } from '@/contexts/PomodoroContext';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  selectionMode?: boolean;
}

export function TaskCard({ task, onPress, selectionMode = false }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#FF6B35';
      case 'medium':
        return '#FFD23F';
      case 'low':
        return '#39FF14';
      default:
        return '#B0B8C4';
    }
  };

  const progress = task.estimatedPomodoros > 0 
    ? (task.completedPomodoros / task.estimatedPomodoros) * 100 
    : 0;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        task.isCompleted && styles.completedCard,
      ]}
      onPress={onPress}
      disabled={!onPress}
      testID={`task-card-${task.id}`}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(task.priority) }]} />
          <Text style={[styles.title, task.isCompleted && styles.completedText]}>
            {task.title}
          </Text>
        </View>
        {!selectionMode && (
          <TouchableOpacity style={styles.menuButton}>
            <MoreVertical color="#B0B8C4" size={20} />
          </TouchableOpacity>
        )}
      </View>

      {task.description && (
        <Text style={[styles.description, task.isCompleted && styles.completedText]}>
          {task.description}
        </Text>
      )}

      <View style={styles.footer}>
        <View style={styles.progressContainer}>
          <Clock color="#B0B8C4" size={16} />
          <Text style={styles.progressText}>
            {task.completedPomodoros}/{task.estimatedPomodoros} Pomodoros
          </Text>
        </View>
        
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{task.category}</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {task.isCompleted && (
        <View style={styles.completedOverlay}>
          <CheckCircle color="#39FF14" size={24} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  completedCard: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#B0B8C4',
  },
  menuButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: '#B0B8C4',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#B0B8C4',
  },
  categoryContainer: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    color: '#00D4FF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00D4FF',
    borderRadius: 2,
  },
  completedOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});