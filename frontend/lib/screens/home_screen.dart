import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import '../widgets/home_background.dart';
import '../widgets/onego_logo.dart';

class OnegoHomeScreen extends StatefulWidget {
  const OnegoHomeScreen({
    super.key,
    this.clerkUserId,
    this.clerkEmail,
    this.clerkName,
  });

  /// Clerk authenticated user data (null if opened as guest)
  final String? clerkUserId;
  final String? clerkEmail;
  final String? clerkName;

  @override
  State<OnegoHomeScreen> createState() => _OnegoHomeScreenState();
}

class _OnegoHomeScreenState extends State<OnegoHomeScreen> {
  int _selectedDockIndex = -1;

  // Infinite Carousel Controller (initialized inline for instant hot reload safety)
  final PageController _pageController = PageController(
    viewportFraction: 0.35,
    initialPage: 1001,
  );
  int _currentPage = 1001;
  Timer? _autoSlideTimer;

  @override
  void initState() {
    super.initState();
    _startAutoSlide();
  }

  @override
  void reassemble() {
    super.reassemble();
    _restartAutoSlide();
  }

  void _startAutoSlide() {
    _autoSlideTimer?.cancel();
    _autoSlideTimer = Timer.periodic(const Duration(milliseconds: 3500), (timer) {
      if (!mounted || !_pageController.hasClients) return;
      _pageController.animateToPage(
        _currentPage + 1,
        duration: const Duration(milliseconds: 650),
        curve: Curves.easeInOutCubic,
      );
    });
  }

  void _restartAutoSlide() {
    _autoSlideTimer?.cancel();
    _startAutoSlide();
  }

  @override
  void dispose() {
    _autoSlideTimer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // -------------------------------------------------------------
          // 1. Exact Background Image as requested (In-memory, hot-reload proof)
          // -------------------------------------------------------------
          const HomeBackground(),

          // -------------------------------------------------------------
          // 2. Fullscreen Content Layout (Edge-to-edge, no cutoff)
          // -------------------------------------------------------------
          SafeArea(
            left: false,
            right: false,
            top: true,
            bottom: true,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: Column(
                children: [
                  // Top Row: Profile Avatar & Search Bar
                  _buildTopBar(context),

                  // Space between Search Bar and Cards
                  const SizedBox(height: 12),

                  // Middle Section: Auto & Manually Slidable Cards Carousel
                  Expanded(
                    child: Center(
                      child: _buildCardsSection(context),
                    ),
                  ),

                  // Space between Cards and Bottom Dock Icons
                  const SizedBox(height: 12),

                  // Bottom Dock: 8 Glowing Spherical 3D Icon Buttons
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    alignment: Alignment.center,
                    child: _buildBottomDock(context),
                  ),

                  const SizedBox(height: 4),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ===========================================================================
  // TOP BAR: Profile Avatar + Search Capsule
  // ===========================================================================
  Widget _buildTopBar(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // User Profile Avatar with glowing border
        Container(
          width: 38,
          height: 38,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.4),
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF2E66FF).withValues(alpha: 0.35),
                blurRadius: 10,
                spreadRadius: 1,
              ),
            ],
          ),
          child: ClipOval(
            child: Image.network(
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(
                color: const Color(0xFF2A2D3A),
                child: const Icon(
                  Icons.person,
                  color: Colors.white70,
                  size: 22,
                ),
              ),
            ),
          ),
        ),

        if (widget.clerkName != null || widget.clerkEmail != null) ...[
          const SizedBox(width: 8),
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 120),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.clerkName ?? widget.clerkEmail?.split('@').first ?? 'User',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                ),
                Text(
                  widget.clerkEmail ?? 'Clerk Verified',
                  style: const TextStyle(
                    color: Colors.white60,
                    fontSize: 10,
                  ),
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                ),
              ],
            ),
          ),
        ],

        const SizedBox(width: 12),

        // Search Bar Capsule
        Container(
          width: 440,
          height: 38,
          padding: const EdgeInsets.symmetric(horizontal: 14),
          decoration: BoxDecoration(
            color: const Color(0xFF13151D).withValues(alpha: 0.92),
            borderRadius: BorderRadius.circular(22),
            border: Border.all(
              color: const Color(0xFF232736),
              width: 1.2,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.35),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: const Row(
            children: [
              Icon(
                Icons.search_rounded,
                color: Color(0xFF8E95A5),
                size: 18,
              ),
              SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Quick search...',
                  style: TextStyle(
                    color: Color(0xFF555B6E),
                    fontSize: 12.5,
                    fontWeight: FontWeight.w400,
                    letterSpacing: 0.2,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // ===========================================================================
  // CARDS SECTION: Automatic & Manual Carousel Slider
  // ===========================================================================
  Widget _buildCardsSection(BuildContext context) {
    return SizedBox(
      height: 162,
      child: ScrollConfiguration(
            behavior: const ScrollBehavior().copyWith(
              dragDevices: {
                PointerDeviceKind.touch,
                PointerDeviceKind.mouse,
                PointerDeviceKind.trackpad,
                PointerDeviceKind.stylus,
              },
            ),
            child: PageView.builder(
              controller: _pageController,
              physics: const BouncingScrollPhysics(),
              onPageChanged: (page) {
                setState(() {
                  _currentPage = page;
                });
                _restartAutoSlide();
              },
              itemBuilder: (context, index) {
                final int cardIndex = index % 4;
                final bool isCenter = (index == _currentPage);

                return Center(
                  child: AnimatedScale(
                    scale: isCenter ? 1.05 : 0.92,
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeOutCubic,
                    child: AnimatedOpacity(
                      opacity: isCenter ? 1.0 : 0.72,
                      duration: const Duration(milliseconds: 300),
                      child: GestureDetector(
                        onTap: () {
                          if (!isCenter) {
                            _pageController.animateToPage(
                              index,
                              duration: const Duration(milliseconds: 450),
                              curve: Curves.easeInOutCubic,
                            );
                          }
                        },
                        child: _buildCardByIndex(cardIndex, isCenter: isCenter),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        );
      }

  Widget _buildCardByIndex(int cardIndex, {required bool isCenter}) {
    switch (cardIndex) {
      case 0:
        return _buildJavaScriptCard(isCenter);
      case 1:
        return _buildPythonCard(isCenter);
      case 2:
        return _buildJavaCard(isCenter);
      case 3:
      default:
        return _buildFlutterCard(isCenter);
    }
  }

  // ---------------------------------------------------------------------------
  // Card 1: JAVASCRIPT
  // ---------------------------------------------------------------------------
  Widget _buildJavaScriptCard(bool isSelected) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 250),
      width: 250,
      height: 142,
      decoration: BoxDecoration(
        color: const Color(0xFF101217),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isSelected
              ? const Color(0xFFF7DF1E).withValues(alpha: 0.8)
              : const Color(0xFF222530),
          width: isSelected ? 1.8 : 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.5),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
          if (isSelected)
            BoxShadow(
              color: const Color(0xFFF7DF1E).withValues(alpha: 0.2),
              blurRadius: 16,
              spreadRadius: 1,
            ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Stack(
          children: [
            // Top-right Onego badge
            Positioned(
              top: 10,
              right: 12,
              child: Container(
                width: 26,
                height: 26,
                decoration: BoxDecoration(
                  color: const Color(0xFFD60812),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFD60812).withValues(alpha: 0.45),
                      blurRadius: 6,
                      spreadRadius: 1,
                    ),
                  ],
                ),
                child: const Center(
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: 3.0),
                    child: OnegoLogo(color: Colors.white, width: 18),
                  ),
                ),
              ),
            ),

            // Card Content
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 12.0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // JS Yellow Icon Box
                  Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      color: const Color(0xFFF7DF1E),
                      borderRadius: BorderRadius.circular(8),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFF7DF1E).withValues(alpha: 0.25),
                          blurRadius: 8,
                        ),
                      ],
                    ),
                    child: const Center(
                      child: Text(
                        'JS',
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 27,
                          fontWeight: FontWeight.w900,
                          letterSpacing: -1.2,
                          fontFamily: 'Roboto',
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(width: 12),

                  // Skill Info
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'JAVASCRIPT SKILL',
                          style: TextStyle(
                            color: Color(0xFFE5A93C),
                            fontSize: 8.5,
                            letterSpacing: 1.4,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'JAVASCRIPT',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16.5,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.3,
                          ),
                        ),
                        SizedBox(height: 3),
                        Text(
                          'EXP: 3+ YRS',
                          style: TextStyle(
                            color: Color(0xFF8B92A4),
                            fontSize: 10,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Bottom-right green pill badge
            Positioned(
              bottom: 10,
              right: 12,
              child: _buildGreenPillBadge('4.8'),
            ),
          ],
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Card 2: PYTHON (Featured red gradient card)
  // ---------------------------------------------------------------------------
  Widget _buildPythonCard(bool isSelected) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 250),
      width: 260,
      height: 148,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFFD60812),
            Color(0xFFA1050E),
            Color(0xFF650005),
          ],
          stops: [0.0, 0.55, 1.0],
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFD60812).withValues(alpha: 0.5),
            blurRadius: 24,
            spreadRadius: 2,
            offset: const Offset(0, 5),
          ),
          if (isSelected)
            BoxShadow(
              color: Colors.white.withValues(alpha: 0.2),
              blurRadius: 12,
              spreadRadius: 1,
            ),
        ],
        border: Border.all(
          color: Colors.white.withValues(alpha: isSelected ? 0.45 : 0.2),
          width: isSelected ? 1.8 : 1.0,
        ),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Top title "Python Skill"
              const Text(
                'Python Skill',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  letterSpacing: -0.2,
                ),
              ),

              // Center logo + title
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Dual-color Python logo
                  const SizedBox(
                    width: 46,
                    height: 46,
                    child: CustomPaint(
                      painter: PythonLogoPainter(),
                    ),
                  ),

                  const SizedBox(width: 12),

                  // Python text and details
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'PYTHON',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.0,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 5,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.black.withValues(alpha: 0.25),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'Pro Skill',
                              style: TextStyle(
                                color: Color(0xFFFFD43D),
                                fontSize: 8.5,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          const SizedBox(width: 5),
                          const Text(
                            'DOC: 2500',
                            style: TextStyle(
                              color: Colors.white70,
                              fontSize: 9.5,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),

              // Bottom subtle indicator / dots
              Row(
                children: [
                  Container(
                    width: 5,
                    height: 5,
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 5),
                  const Text(
                    'Core Portfolio Specialization',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 9.5,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Card 3: JAVA
  // ---------------------------------------------------------------------------
  Widget _buildJavaCard(bool isSelected) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 250),
      width: 250,
      height: 142,
      decoration: BoxDecoration(
        color: const Color(0xFF101217),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isSelected
              ? const Color(0xFFE5A93C).withValues(alpha: 0.8)
              : const Color(0xFF222530),
          width: isSelected ? 1.8 : 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.5),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
          if (isSelected)
            BoxShadow(
              color: const Color(0xFFE5A93C).withValues(alpha: 0.2),
              blurRadius: 16,
              spreadRadius: 1,
            ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Stack(
          children: [
            // Card Content
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 12.0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Steaming Java Coffee Icon
                  const SizedBox(
                    width: 48,
                    height: 48,
                    child: CustomPaint(
                      painter: JavaCoffeeCupPainter(),
                    ),
                  ),

                  const SizedBox(width: 12),

                  // Skill Info
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'JAVA SKILL',
                          style: TextStyle(
                            color: Color(0xFFE5A93C),
                            fontSize: 8.5,
                            letterSpacing: 1.4,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'JAVA',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16.5,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.3,
                          ),
                        ),
                        SizedBox(height: 3),
                        Text(
                          'EXP: 3000',
                          style: TextStyle(
                            color: Color(0xFF8B92A4),
                            fontSize: 10,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Bottom-right green pill badge
            Positioned(
              bottom: 10,
              right: 12,
              child: _buildGreenPillBadge('PRO'),
            ),
          ],
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Card 4: FLUTTER
  // ---------------------------------------------------------------------------
  Widget _buildFlutterCard(bool isSelected) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 250),
      width: 250,
      height: 142,
      decoration: BoxDecoration(
        color: const Color(0xFF101217),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isSelected
              ? const Color(0xFF0284C7).withValues(alpha: 0.8)
              : const Color(0xFF222530),
          width: isSelected ? 1.8 : 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.5),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
          if (isSelected)
            BoxShadow(
              color: const Color(0xFF0284C7).withValues(alpha: 0.25),
              blurRadius: 16,
              spreadRadius: 1,
            ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Stack(
          children: [
            // Top-right Onego badge
            Positioned(
              top: 10,
              right: 12,
              child: Container(
                width: 26,
                height: 26,
                decoration: BoxDecoration(
                  color: const Color(0xFFD60812),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFD60812).withValues(alpha: 0.45),
                      blurRadius: 6,
                      spreadRadius: 1,
                    ),
                  ],
                ),
                child: const Center(
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: 3.0),
                    child: OnegoLogo(color: Colors.white, width: 18),
                  ),
                ),
              ),
            ),

            // Card Content
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 12.0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Flutter Logo
                  const SizedBox(
                    width: 48,
                    height: 48,
                    child: CustomPaint(
                      painter: FlutterLogoPainter(),
                    ),
                  ),

                  const SizedBox(width: 12),

                  // Skill Info
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'FLUTTER SKILL',
                          style: TextStyle(
                            color: Color(0xFF38BDF8),
                            fontSize: 8.5,
                            letterSpacing: 1.4,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'FLUTTER',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16.5,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.3,
                          ),
                        ),
                        SizedBox(height: 3),
                        Text(
                          'EXP: 3+ YRS',
                          style: TextStyle(
                            color: Color(0xFF8B92A4),
                            fontSize: 10,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Bottom-right green pill badge
            Positioned(
              bottom: 10,
              right: 12,
              child: _buildGreenPillBadge('4.9'),
            ),
          ],
        ),
      ),
    );
  }

  // Green pill badge widget used on cards
  Widget _buildGreenPillBadge(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: const Color(0xFF00E676).withValues(alpha: 0.16),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: const Color(0xFF00E676),
          width: 1.0,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 4,
            height: 4,
            decoration: const BoxDecoration(
              color: Color(0xFF00E676),
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: const TextStyle(
              color: Color(0xFF00E676),
              fontSize: 9,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.4,
            ),
          ),
        ],
      ),
    );
  }

  // ===========================================================================
  // BOTTOM DOCK: 8 Glowing Spherical 3D Orbs with Labels (Tighter spacing)
  // ===========================================================================
  Widget _buildBottomDock(BuildContext context) {
    final List<_DockItemData> dockItems = [
      _DockItemData(
        label: 'Education Skill',
        icon: Icons.school_rounded,
        baseColor: const Color(0xFF0066FF),
        highlightColor: const Color(0xFF60A5FA),
        shadowColor: const Color(0xFF1D4ED8),
      ),
      _DockItemData(
        label: 'Projects',
        icon: Icons.business_center_rounded,
        baseColor: const Color(0xFF9333EA),
        highlightColor: const Color(0xFFC084FC),
        shadowColor: const Color(0xFF6B21A8),
      ),
      _DockItemData(
        label: 'Summary',
        icon: Icons.description_rounded,
        baseColor: const Color(0xFF06B6D4),
        highlightColor: const Color(0xFF67E8F9),
        shadowColor: const Color(0xFF0E7490),
      ),
      _DockItemData(
        label: 'Settings',
        icon: Icons.settings_rounded,
        baseColor: const Color(0xFF64748B),
        highlightColor: const Color(0xFF94A3B8),
        shadowColor: const Color(0xFF334155),
      ),
      _DockItemData(
        label: 'Achievement',
        icon: Icons.emoji_events_rounded,
        baseColor: const Color(0xFFD97706),
        highlightColor: const Color(0xFFFBBF24),
        shadowColor: const Color(0xFF92400E),
      ),
      _DockItemData(
        label: 'Calendar',
        icon: Icons.calendar_month_rounded,
        baseColor: const Color(0xFF0284C7),
        highlightColor: const Color(0xFF38BDF8),
        shadowColor: const Color(0xFF0369A1),
      ),
      _DockItemData(
        label: 'Notifications',
        icon: Icons.notifications_rounded,
        baseColor: const Color(0xFFE11D48),
        highlightColor: const Color(0xFFFB7185),
        shadowColor: const Color(0xFF9F1239),
      ),
      _DockItemData(
        label: 'Messages',
        icon: Icons.chat_bubble_rounded,
        baseColor: const Color(0xFF16A34A),
        highlightColor: const Color(0xFF4ADE80),
        shadowColor: const Color(0xFF14532D),
      ),
    ];

    return Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: List.generate(dockItems.length, (index) {
        final item = dockItems[index];
        final bool isSelected = _selectedDockIndex == index;
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 5.0),
          child: _buildGlossyOrbButton(
            item: item,
            isSelected: isSelected,
            onTap: () {
              setState(() {
                _selectedDockIndex = index;
              });
            },
          ),
        );
      }),
    );
  }

  // Individual Glossy Sphere / 3D Marble Orb
  Widget _buildGlossyOrbButton({
    required _DockItemData item,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    const double sphereSize = 50.0;

    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          AnimatedScale(
            scale: isSelected ? 1.12 : 1.0,
            duration: const Duration(milliseconds: 200),
            child: Container(
              width: sphereSize,
              height: sphereSize,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                boxShadow: [
                  // Outer colored glow
                  BoxShadow(
                    color: item.baseColor.withValues(alpha: isSelected ? 0.75 : 0.45),
                    blurRadius: isSelected ? 16 : 10,
                    spreadRadius: isSelected ? 2 : 0,
                    offset: const Offset(0, 2),
                  ),
                  // Dark ambient bottom shadow
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.6),
                    blurRadius: 6,
                    offset: const Offset(0, 4),
                  ),
                ],
                // 3D Sphere Radial Gradient: Light origin at top-left
                gradient: RadialGradient(
                  center: const Alignment(-0.35, -0.4),
                  radius: 0.9,
                  colors: [
                    item.highlightColor,
                    item.baseColor,
                    item.shadowColor,
                    Colors.black.withValues(alpha: 0.75),
                  ],
                  stops: const [0.0, 0.45, 0.85, 1.0],
                ),
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Specular Glass Arc Highlight at top of sphere
                  Positioned(
                    top: 4,
                    left: 8,
                    child: Container(
                      width: sphereSize * 0.48,
                      height: sphereSize * 0.22,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.all(
                          Radius.elliptical(sphereSize * 0.48, sphereSize * 0.22),
                        ),
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.white.withValues(alpha: 0.75),
                            Colors.white.withValues(alpha: 0.0),
                          ],
                        ),
                      ),
                    ),
                  ),

                  // Bottom subtle rim light reflection
                  Positioned(
                    bottom: 3,
                    child: Container(
                      width: sphereSize * 0.35,
                      height: 2,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.25),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),

                  // Icon in the center
                  Icon(
                    item.icon,
                    color: Colors.white,
                    size: 23,
                    shadows: [
                      Shadow(
                        color: Colors.black.withValues(alpha: 0.6),
                        blurRadius: 4,
                        offset: const Offset(0, 1.5),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 6),

          // Label text below orb
          SizedBox(
            width: 66,
            child: Text(
              item.label,
              textAlign: TextAlign.center,
              maxLines: 2,
              style: TextStyle(
                color: isSelected ? Colors.white : const Color(0xFFC0C5D4),
                fontSize: 10.2,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                letterSpacing: 0.1,
                shadows: const [
                  Shadow(
                    color: Colors.black,
                    blurRadius: 4,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// Data holder for bottom dock
class _DockItemData {
  final String label;
  final IconData icon;
  final Color baseColor;
  final Color highlightColor;
  final Color shadowColor;

  const _DockItemData({
    required this.label,
    required this.icon,
    required this.baseColor,
    required this.highlightColor,
    required this.shadowColor,
  });
}

// =============================================================================
// HIGH-FIDELITY VECTOR PAINTER: Authentic Python Two-Snake Logo
// =============================================================================
class PythonLogoPainter extends CustomPainter {
  const PythonLogoPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final double w = size.width;
    final double h = size.height;

    // Blue snake (Top and left head)
    final Paint bluePaint = Paint()
      ..color = const Color(0xFF387EB8)
      ..style = PaintingStyle.fill
      ..isAntiAlias = true;

    // Yellow snake (Bottom and right head)
    final Paint yellowPaint = Paint()
      ..color = const Color(0xFFFFD43D)
      ..style = PaintingStyle.fill
      ..isAntiAlias = true;

    // White eye dots
    final Paint eyePaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill
      ..isAntiAlias = true;

    // Scale from 100x100 reference
    canvas.save();
    canvas.scale(w / 100, h / 100);

    // --- BLUE SNAKE PATH ---
    final Path blueSnake = Path();
    blueSnake.moveTo(50, 6);
    blueSnake.cubicTo(26, 6, 27, 16, 27, 16);
    blueSnake.lineTo(27, 27);
    blueSnake.lineTo(51, 27);
    blueSnake.lineTo(51, 35);
    blueSnake.lineTo(17, 35);
    blueSnake.cubicTo(17, 35, 6, 33, 6, 57);
    blueSnake.cubicTo(6, 78, 16, 76, 16, 76);
    blueSnake.lineTo(25, 76);
    blueSnake.lineTo(25, 64);
    blueSnake.cubicTo(25, 52, 36, 52, 36, 52);
    blueSnake.lineTo(60, 52);
    blueSnake.cubicTo(69, 52, 69, 44, 69, 44);
    blueSnake.lineTo(69, 23);
    blueSnake.cubicTo(69, 23, 71, 6, 50, 6);
    blueSnake.close();

    canvas.drawPath(blueSnake, bluePaint);

    // Blue Snake Eye (Top Left)
    canvas.drawCircle(const Offset(37, 18), 3.2, eyePaint);

    // --- YELLOW SNAKE PATH (Rotated 180 symmetric feel) ---
    final Path yellowSnake = Path();
    yellowSnake.moveTo(50, 94);
    yellowSnake.cubicTo(74, 94, 73, 84, 73, 84);
    yellowSnake.lineTo(73, 73);
    yellowSnake.lineTo(49, 73);
    yellowSnake.lineTo(49, 65);
    yellowSnake.lineTo(83, 65);
    yellowSnake.cubicTo(83, 65, 94, 67, 94, 43);
    yellowSnake.cubicTo(94, 22, 84, 24, 84, 24);
    yellowSnake.lineTo(75, 24);
    yellowSnake.lineTo(75, 36);
    yellowSnake.cubicTo(75, 48, 64, 48, 64, 48);
    yellowSnake.lineTo(40, 48);
    yellowSnake.cubicTo(31, 48, 31, 56, 31, 56);
    yellowSnake.lineTo(31, 77);
    yellowSnake.cubicTo(31, 77, 29, 94, 50, 94);
    yellowSnake.close();

    canvas.drawPath(yellowSnake, yellowPaint);

    // Yellow Snake Eye (Bottom Right)
    canvas.drawCircle(const Offset(63, 82), 3.2, eyePaint);

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// =============================================================================
// HIGH-FIDELITY VECTOR PAINTER: Steaming Java Coffee Cup
// =============================================================================
class JavaCoffeeCupPainter extends CustomPainter {
  const JavaCoffeeCupPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final double w = size.width;
    final double h = size.height;

    canvas.save();
    canvas.scale(w / 100, h / 100);

    final Paint whiteStroke = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.5
      ..strokeCap = StrokeCap.round
      ..isAntiAlias = true;

    final Paint amberSteam = Paint()
      ..color = const Color(0xFFE5A93C)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.2
      ..strokeCap = StrokeCap.round
      ..isAntiAlias = true;

    final Paint saucerPaint = Paint()
      ..color = Colors.white70
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.0
      ..strokeCap = StrokeCap.round
      ..isAntiAlias = true;

    // 1. Steam waves rising
    final Path steam1 = Path();
    steam1.moveTo(42, 36);
    steam1.cubicTo(36, 28, 48, 20, 42, 12);
    canvas.drawPath(steam1, amberSteam);

    final Path steam2 = Path();
    steam2.moveTo(56, 36);
    steam2.cubicTo(50, 28, 62, 18, 56, 10);
    canvas.drawPath(steam2, amberSteam);

    // 2. Coffee Cup Body
    final Path cup = Path();
    cup.moveTo(26, 44);
    cup.lineTo(74, 44);
    cup.cubicTo(74, 68, 66, 76, 50, 76);
    cup.cubicTo(34, 76, 26, 68, 26, 44);
    cup.close();
    canvas.drawPath(cup, whiteStroke);

    // 3. Cup Handle
    final Path handle = Path();
    handle.moveTo(73, 48);
    handle.cubicTo(86, 48, 86, 64, 70, 66);
    canvas.drawPath(handle, whiteStroke);

    // 4. Saucer / Base plate
    final Path saucer = Path();
    saucer.moveTo(20, 84);
    saucer.cubicTo(35, 90, 65, 90, 80, 84);
    canvas.drawPath(saucer, saucerPaint);

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// =============================================================================
// HIGH-FIDELITY VECTOR PAINTER: Flutter Logo
// =============================================================================
class FlutterLogoPainter extends CustomPainter {
  const FlutterLogoPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final double w = size.width;
    final double h = size.height;

    canvas.save();
    canvas.scale(w / 100, h / 100);

    final Paint lightBlue = Paint()
      ..color = const Color(0xFF54C5F8)
      ..style = PaintingStyle.fill
      ..isAntiAlias = true;

    final Paint darkBlue = Paint()
      ..color = const Color(0xFF01579B)
      ..style = PaintingStyle.fill
      ..isAntiAlias = true;

    final Paint midBlue = Paint()
      ..color = const Color(0xFF29B6F6)
      ..style = PaintingStyle.fill
      ..isAntiAlias = true;

    // Top wing
    final Path topWing = Path()
      ..moveTo(60, 10)
      ..lineTo(20, 50)
      ..lineTo(37, 67)
      ..lineTo(94, 10)
      ..close();
    canvas.drawPath(topWing, lightBlue);

    // Lower-left wing
    final Path lowerWing = Path()
      ..moveTo(55, 65)
      ..lineTo(37, 83)
      ..lineTo(54, 100)
      ..lineTo(72, 82)
      ..close();
    canvas.drawPath(lowerWing, midBlue);

    // Lower-right wing
    final Path darkWing = Path()
      ..moveTo(55, 65)
      ..lineTo(72, 82)
      ..lineTo(94, 60)
      ..lineTo(77, 43)
      ..close();
    canvas.drawPath(darkWing, darkBlue);

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
