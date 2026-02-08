import 'package:flutter/material.dart';

void main() {
  runApp(const AstraApp());
}

class AstraApp extends StatelessWidget {
  const AstraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Astra',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0B0B0B), // Deep Obsidian
        primaryColor: const Color(0xFF00FFFF), // Cyan
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF00FFFF), // Cyan
          secondary: Color(0xFFFF5F1F), // Neon Orange
          error: Color(0xFFFF5F1F),
          surface: Color(0xFF1A1A1A),
          onPrimary: Colors.black,
          onSecondary: Colors.black,
        ),
        textTheme: const TextTheme(
          headlineMedium: TextStyle(
            color: Color(0xFF00FFFF),
            fontFamily: 'Courier', // Monospace feel
            fontWeight: FontWeight.bold,
          ),
          bodyMedium: TextStyle(
            color: Colors.white70,
            fontFamily: 'Courier',
          ),
        ),
        useMaterial3: true,
      ),
      home: const CommandDeck(),
    );
  }
}

class CommandDeck extends StatelessWidget {
  const CommandDeck({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'COMMAND DECK',
          style: TextStyle(letterSpacing: 2.0, fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'SHIP STATUS: NOMINAL',
              style: TextStyle(
                color: Color(0xFF00FFFF),
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 32),
            const Text(
              'HULL INTEGRITY',
              style: TextStyle(
                color: Colors.white,
                letterSpacing: 1.5,
                fontSize: 12,
              ),
            ),
            const SizedBox(height: 8),
            const HullIntegrityBar(integrity: 0.85),
            const SizedBox(height: 48),
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                children: const [
                  ModuleCard(name: 'MESS HALL', status: 'CLEAN'),
                  ModuleCard(name: 'LIFE SUPPORT', status: 'RED ALERT', isWarning: true),
                  ModuleCard(name: 'ENGINE ROOM', status: 'STABLE'),
                  ModuleCard(name: 'BRIDGE', status: 'ONLINE'),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class HullIntegrityBar extends StatelessWidget {
  final double integrity;

  const HullIntegrityBar({super.key, required this.integrity});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        LinearProgressIndicator(
          value: integrity,
          backgroundColor: Colors.white10,
          color: const Color(0xFFB0FF00), // Acid Green
          minHeight: 12,
        ),
        const SizedBox(height: 4),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              '${(integrity * 100).toInt()}%',
              style: const TextStyle(
                color: Color(0xFFB0FF00),
                fontWeight: FontWeight.bold,
              ),
            ),
            const Text(
              'STABLE',
              style: TextStyle(color: Colors.white38, fontSize: 10),
            ),
          ],
        ),
      ],
    );
  }
}

class ModuleCard extends StatelessWidget {
  final String name;
  final String status;
  final bool isWarning;

  const ModuleCard({
    super.key,
    required this.name,
    required this.status,
    this.isWarning = false,
  });

  @override
  Widget build(BuildContext context) {
    final color = isWarning ? const Color(0xFFFF5F1F) : const Color(0xFF00FFFF);
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        border: Border.all(color: color.withOpacity(0.5)),
        borderRadius: BorderRadius.circular(8),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            name,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.0,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            status,
            style: TextStyle(
              color: color,
              fontSize: 10,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
