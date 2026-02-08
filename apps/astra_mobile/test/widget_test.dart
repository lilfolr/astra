import 'package:flutter_test/flutter_test.dart';
import 'package:astra_mobile/main.dart';

void main() {
  testWidgets('Command Deck smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const AstraApp());

    // Verify that the Command Deck is displayed.
    expect(find.text('COMMAND DECK'), findsOneWidget);
    expect(find.text('SHIP STATUS: NOMINAL'), findsOneWidget);
    expect(find.text('HULL INTEGRITY'), findsOneWidget);

    // Verify that the Hull Integrity percentage is displayed.
    expect(find.text('85%'), findsOneWidget);
  });
}
