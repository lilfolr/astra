import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar } from 'react-native';
import Colors from '../theme/colors';

const CommandDeck = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.deepObsidian} />
      <View style={styles.header}>
        <Text style={styles.title}>COMMAND DECK</Text>
        <View style={styles.integrityBarContainer}>
          <View style={styles.integrityBarLabelContainer}>
            <Text style={styles.integrityBarLabel}>HULL INTEGRITY</Text>
            <Text style={styles.integrityValue}>100%</Text>
          </View>
          <View style={styles.integrityBarBackground}>
            <View style={styles.integrityBarFill} />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.statusText}>ALL SYSTEMS NOMINAL</Text>
        <View style={styles.placeholderCard}>
          <Text style={styles.cardText}>INITIALIZING SHIP SYSTEMS...</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deepObsidian,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cyan,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.cyan,
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
    color: Colors.white,
    fontSize: 12,
    letterSpacing: 1,
  },
  integrityValue: {
    color: Colors.acidGreen,
    fontSize: 12,
    fontWeight: 'bold',
  },
  integrityBarBackground: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  integrityBarFill: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.acidGreen,
    shadowColor: Colors.acidGreen,
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
    color: Colors.acidGreen,
    fontSize: 18,
    letterSpacing: 3,
    marginBottom: 30,
  },
  placeholderCard: {
    width: '100%',
    padding: 40,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    borderRadius: 8,
    alignItems: 'center',
  },
  cardText: {
    color: Colors.cyan,
    fontSize: 14,
    letterSpacing: 1,
  },
});

export default CommandDeck;
