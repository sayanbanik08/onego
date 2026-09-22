import 'dart:async';
import 'package:flutter/material.dart';
import '../widgets/onego_logo.dart';
import 'clerk_auth_screen.dart';

class OnegoSplashScreen extends StatefulWidget {
  const OnegoSplashScreen({super.key});

  static const Color brandRed = Color(0xFFEC020D);

  @override
  State<OnegoSplashScreen> createState() => _OnegoSplashScreenState();
}

class _OnegoSplashScreenState extends State<OnegoSplashScreen> {
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    // Move to the next page after exactly 2 seconds
    _timer = Timer(const Duration(seconds: 2), _navigateToLogin);
  }

  void _navigateToLogin() {
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) =>
            const OnegoAuthScreen(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(
            opacity: CurvedAnimation(
              parent: animation,
              curve: Curves.easeInOut,
            ),
            child: child,
          );
        },
        transitionDuration: const Duration(milliseconds: 600),
      ),
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: OnegoSplashScreen.brandRed,
      body: Center(
        child: OnegoLogo(
          color: Colors.white,
        ),
      ),
    );
  }
}
