import 'package:app_links/app_links.dart';
import 'package:clerk_flutter/clerk_flutter.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'screens/splash_screen.dart';

const _clerkPublishableKey = String.fromEnvironment(
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  defaultValue: 'pk_test_cmVsaWV2ZWQtY291Z2FyLTk3NTguY2xlcmsuYWNjb3VudHMuZGV2JA',
);

const _oauthCallbackUri = 'onego://oauth-callback';

// Instantiate this before the app starts so an OAuth callback received while
// the app is opening is not lost.
final _appLinks = AppLinks();

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Strictly lock orientation to landscape
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.landscapeLeft,
    DeviceOrientation.landscapeRight,
  ]);

  // Immersive edge-to-edge mode: hide status and navigation bars
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);

  runApp(OnegoApp(deepLinkStream: _appLinks.uriLinkStream));
}

class OnegoApp extends StatelessWidget {
  const OnegoApp({super.key, required this.deepLinkStream});

  final Stream<Uri?> deepLinkStream;

  @override
  Widget build(BuildContext context) {
    return ClerkAuth(
      config: ClerkAuthConfig(
        publishableKey: _clerkPublishableKey,
        // Google rejects OAuth authentication inside an embedded WebView.
        // Using a custom scheme opens the flow in the system browser and lets
        // the callback return safely to this app.
        redirectionGenerator: (req, res) => Uri.parse(_oauthCallbackUri),
        deepLinkStream: deepLinkStream,
      ),
      child: MaterialApp(
        title: 'Onego',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          brightness: Brightness.light,
          scaffoldBackgroundColor: const Color(0xFFFCFCFD),
          fontFamily: 'Roboto',
        ),
        home: const OnegoSplashScreen(),
      ),
    );
  }
}

