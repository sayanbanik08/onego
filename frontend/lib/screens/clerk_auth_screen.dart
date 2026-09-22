import 'package:clerk_flutter/clerk_flutter.dart';
import 'package:flutter/material.dart';

import 'home_screen.dart';
import '../widgets/onego_logo.dart';

/// Onego's custom Clerk sign-in entry screen.
class OnegoAuthScreen extends StatelessWidget {
  const OnegoAuthScreen({super.key});

  static const Color brandRed = Color(0xFFDC0015);
  static const Color darkText = Color(0xFF1A1A1E);
  static const Color subText = Color(0xFF8E8E93);
  static const Color borderGrey = Color(0xFFE5E5EA);

  @override
  Widget build(BuildContext context) {
    return ClerkAuthBuilder(
      signedInBuilder: (context, authState) {
        final user = authState.user;
        final emailList = user?.emailAddresses;
        final email = (emailList != null && emailList.isNotEmpty) ? emailList.first.emailAddress : null;
        final name = user != null ? '${user.firstName ?? ''} ${user.lastName ?? ''}'.trim() : null;

        debugPrint('CLERK_AUTH_DEBUG');
        debugPrint('signedIn = ${authState.user != null}');
        debugPrint('sessionExists = ${authState.session != null}');
        debugPrint('userIdExists = ${user?.id != null}');
        debugPrint('userId = ${user?.id}');
        debugPrint('emailExists = ${email != null}');

        return OnegoHomeScreen(
          clerkUserId: user?.id,
          clerkEmail: email?.isNotEmpty == true ? email : null,
          clerkName: name?.isNotEmpty == true ? name : null,
        );
      },
      signedOutBuilder: (context, authState) => const _SignedOutAuthScreen(),
    );
  }
}

class _SignedOutAuthScreen extends StatelessWidget {
  const _SignedOutAuthScreen();

  void _openClerkAuthentication(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => const _ClerkAuthenticationPage(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.sizeOf(context);
    final isWide = screenSize.width >= 700;

    return Scaffold(
      backgroundColor: const Color(0xFFFCFCFD),
      body: ClerkErrorListener(
        child: Stack(
          children: [
            _AmbientGlow(
              top: -120,
              left: screenSize.width * 0.25,
              width: 440,
              height: 280,
              color: const Color(0xFFFF3B30).withValues(alpha:0.12),
            ),
            _AmbientGlow(
              bottom: -90,
              left: -60,
              width: 360,
              height: 360,
              color: const Color(0xFFFFB800).withValues(alpha:0.18),
            ),
            _AmbientGlow(
              bottom: -80,
              left: screenSize.width * 0.40,
              width: 300,
              height: 240,
              color: const Color(0xFFFF453A).withValues(alpha:0.09),
            ),
            SafeArea(
              child: isWide
                  ? Row(
                      children: [
                        const Expanded(child: _BrandPanel()),
                        const _CenterDivider(),
                        Expanded(
                          child: _AuthenticationPanel(
                            onLoginTap: () => _openClerkAuthentication(context),
                          ),
                        ),
                      ],
                    )
                  : SingleChildScrollView(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 36,
                      ),
                      child: Column(
                        children: [
                          const _BrandPanel(compact: true),
                          const SizedBox(height: 36),
                          _AuthenticationPanel(
                            onLoginTap: () => _openClerkAuthentication(context),
                          ),
                        ],
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Uses Clerk's documented widget hierarchy without any dialog constraints.
/// It is opened from the custom branded entry button above.
class _ClerkAuthenticationPage extends StatelessWidget {
  const _ClerkAuthenticationPage();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: ClerkErrorListener(
          child: ClerkAuthBuilder(
            signedInBuilder: (context, authState) {
              WidgetsBinding.instance.addPostFrameCallback((_) {
                Navigator.of(context).popUntil((route) => route.isFirst);
              });
              return const SizedBox.shrink();
            },
            signedOutBuilder: (context, authState) =>
                const SingleChildScrollView(child: ClerkAuthentication()),
          ),
        ),
      ),
    );
  }
}

/// Backwards-compatible name used by older call sites.
typedef OnegoClerkAuthScreen = OnegoAuthScreen;

class _BrandPanel extends StatelessWidget {
  const _BrandPanel({this.compact = false});

  final bool compact;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          OnegoLogo(
            color: OnegoAuthScreen.brandRed,
            width: compact ? 240 : 280,
          ),
          SizedBox(height: compact ? 14 : 18),
          Text(
            'MAKE YOUR ONLINE PORTFOLIO IN ONEGO',
            style: TextStyle(
              fontSize: compact ? 11.5 : 12.5,
              fontWeight: FontWeight.w600,
              letterSpacing: compact ? 3.5 : 4.5,
              color: OnegoAuthScreen.subText,
            ),
          ),
        ],
      ),
    );
  }
}

class _CenterDivider extends StatelessWidget {
  const _CenterDivider();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 24,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Container(width: 1, color: OnegoAuthScreen.borderGrey),
          Container(
            width: 22,
            height: 22,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  OnegoAuthScreen.brandRed.withValues(alpha:0.40),
                  OnegoAuthScreen.brandRed.withValues(alpha:0),
                ],
              ),
            ),
          ),
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: OnegoAuthScreen.brandRed,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: OnegoAuthScreen.brandRed.withValues(alpha:0.6),
                  blurRadius: 6,
                  spreadRadius: 1,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _AuthenticationPanel extends StatelessWidget {
  const _AuthenticationPanel({required this.onLoginTap});

  final VoidCallback onLoginTap;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 380),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Text(
                'Welcome back',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w700,
                  letterSpacing: -0.5,
                  color: OnegoAuthScreen.darkText,
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Login to continue your journey',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: OnegoAuthScreen.subText,
                ),
              ),
              const SizedBox(height: 32),
              _AuthActionCard(
                title: 'Log in / Create account',
                isPrimary: true,
                onTap: onLoginTap,
              ),
              const SizedBox(height: 20),
              const _OrDivider(),
              const SizedBox(height: 20),
              _AuthActionCard(
                title: 'Continue as Guest',
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => const OnegoHomeScreen(),
                    ),
                  );
                },
              ),
              const SizedBox(height: 32),
              const _PrivacyFooter(),
            ],
          ),
        ),
      ),
    );
  }
}

class _OrDivider extends StatelessWidget {
  const _OrDivider();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Expanded(child: Divider(height: 1, color: OnegoAuthScreen.borderGrey)),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'or',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w400,
              color: OnegoAuthScreen.subText,
            ),
          ),
        ),
        const Expanded(child: Divider(height: 1, color: OnegoAuthScreen.borderGrey)),
      ],
    );
  }
}

class _AuthActionCard extends StatelessWidget {
  const _AuthActionCard({
    required this.title,
    this.isPrimary = false,
    this.onTap,
  });

  final String title;
  final bool isPrimary;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final foreground = isPrimary ? Colors.white : OnegoAuthScreen.darkText;

    return Container(
      height: 52,
      decoration: BoxDecoration(
        color: isPrimary ? OnegoAuthScreen.brandRed : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: isPrimary
            ? null
            : Border.all(color: OnegoAuthScreen.borderGrey, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: isPrimary
                ? OnegoAuthScreen.brandRed.withValues(alpha:0.25)
                : Colors.black.withValues(alpha:0.02),
            blurRadius: isPrimary ? 14 : 6,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18),
            child: Row(
              children: [
                Icon(Icons.person_outline_rounded, color: foreground, size: 22),
                const SizedBox(width: 14),
                Text(
                  title,
                  style: TextStyle(
                    color: foreground,
                    fontSize: 15,
                    fontWeight: isPrimary ? FontWeight.w600 : FontWeight.w500,
                  ),
                ),
                const Spacer(),
                Icon(Icons.arrow_forward_rounded, color: foreground, size: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _PrivacyFooter extends StatelessWidget {
  const _PrivacyFooter();

  @override
  Widget build(BuildContext context) {
    return const Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(Icons.shield_outlined, size: 16, color: OnegoAuthScreen.subText),
        SizedBox(width: 6),
        Text(
          'Safe. Secure. Private.',
          style: TextStyle(
            fontSize: 12.5,
            fontWeight: FontWeight.w400,
            color: OnegoAuthScreen.subText,
            letterSpacing: 0.1,
          ),
        ),
      ],
    );
  }
}

class _AmbientGlow extends StatelessWidget {
  const _AmbientGlow({
    this.top,
    this.bottom,
    this.left,
    required this.width,
    required this.height,
    required this.color,
  });

  final double? top;
  final double? bottom;
  final double? left;
  final double width;
  final double height;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: top,
      bottom: bottom,
      left: left,
      child: IgnorePointer(
        child: Container(
          width: width,
          height: height,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: RadialGradient(colors: [color, color.withValues(alpha:0)]),
          ),
        ),
      ),
    );
  }
}
