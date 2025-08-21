import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { usePomodoro } from '@/contexts/PomodoroContext';

export function CircularTimer() {
  const { timeLeft, sessionType, currentTask } = usePomodoro();

  const getTotalDuration = () => {
    if (!currentTask) return 25 * 60;
    
    switch (sessionType) {
      case 'work':
        return currentTask.pomodoroConfig.workDuration * 60;
      case 'shortBreak':
        return currentTask.pomodoroConfig.shortBreakDuration * 60;
      case 'longBreak':
        return currentTask.pomodoroConfig.longBreakDuration * 60;
      default:
        return 25 * 60;
    }
  };

  const totalDuration = getTotalDuration();
  const progress = (totalDuration - timeLeft) / totalDuration;
  
  const size = 280;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress * circumference);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionColor = () => {
    switch (sessionType) {
      case 'work':
        return '#00D4FF';
      case 'shortBreak':
        return '#39FF14';
      case 'longBreak':
        return '#FF6B35';
      default:
        return '#00D4FF';
    }
  };

  const getSessionLabel = () => {
    switch (sessionType) {
      case 'work':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Focus Time';
    }
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getSessionColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      <View style={styles.timeContainer}>
        <Text style={[styles.timeText, { color: getSessionColor() }]}>
          {formatTime(timeLeft)}
        </Text>
        <Text style={styles.sessionLabel}>{getSessionLabel()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  svg: {
    transform: [{ rotate: '0deg' }],
  },
  timeContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  sessionLabel: {
    fontSize: 16,
    color: '#B0B8C4',
    fontWeight: '500',
  },
});