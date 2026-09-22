import 'package:flutter_test/flutter_test.dart';
import 'package:onego/main.dart';
import 'package:onego/widgets/onego_logo.dart';

void main() {
  testWidgets('OnegoApp smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(OnegoApp(deepLinkStream: Stream.empty()));

    // Verify that the OnegoLogo widget is present in the tree.
    expect(find.byType(OnegoLogo), findsOneWidget);
  });
}
