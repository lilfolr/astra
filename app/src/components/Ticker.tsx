import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Dimensions } from 'react-native';
import Colors from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TickerProps {
  messages: string[];
}

const Ticker: React.FC<TickerProps> = ({ messages }) => {
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const fullText = messages.join(' • ') + ' • ';

  // We approximate text width. In a real app we might use onLayout
  const textWidth = fullText.length * 8;

  useEffect(() => {
    const startAnimation = () => {
      scrollAnim.setValue(SCREEN_WIDTH);
      Animated.loop(
        Animated.timing(scrollAnim, {
          toValue: -textWidth,
          duration: (textWidth + SCREEN_WIDTH) * 20,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    };

    startAnimation();
  }, [scrollAnim, textWidth]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.text,
          {
            transform: [{ translateX: scrollAnim }],
          },
        ]}
        numberOfLines={1}
      >
        {fullText}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 30,
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default Ticker;
