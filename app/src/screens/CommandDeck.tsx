import React from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import SciFiButton from '../components/SciFiButton';

const CommandDeck = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.dark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />
      <View style={[styles.header, { borderBottomColor: theme.colors.primary }]}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>COMMAND DECK</Text>
        <View style={styles.integrityBarContainer}>
          <View style={styles.integrityBarLabelContainer}>
            <Text style={[styles.integrityBarLabel, { color: theme.colors.text }]}>HULL INTEGRITY</Text>
            <Text style={[styles.integrityValue, { color: theme.colors.success }]}>100%</Text>
          </View>
          <View style={[styles.integrityBarBackground, { backgroundColor: theme.colors.glass }]}>
            <View style={[styles.integrityBarFill, {
              backgroundColor: theme.colors.success,
              shadowColor: theme.colors.success
            }]} />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.statusText, { color: theme.colors.success }]}>ALL SYSTEMS NOMINAL</Text>
        <View style={[styles.placeholderCard, {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border
        }]}>
          <Text style={[styles.cardText, { color: theme.colors.primary }]}>INITIALIZING SHIP SYSTEMS...</Text>
        </View>

        <SciFiButton
          title={`Switch to ${theme.dark ? 'Light' : 'Dark'} Mode`}
          onPress={toggleTheme}
          style={{ marginTop: 40 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 20,
  },
  integrityBarContainer: {
    width: '100%',
  },
  integrityBarLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  integrityBarLabel: {
    fontSize: 12,
    letterSpacing: 1,
  },
  integrityValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  integrityBarBackground: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  integrityBarFill: {
    height: '100%',
    width: '100%',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    letterSpacing: 3,
    marginBottom: 30,
  },
  placeholderCard: {
    width: '100%',
    padding: 40,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  cardText: {
    fontSize: 14,
    letterSpacing: 1,
  },
});

export default CommandDeck;
