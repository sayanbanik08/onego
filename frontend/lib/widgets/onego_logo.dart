import 'dart:math' as math;
import 'package:flutter/material.dart';

/// Pure manual code-drawn Onego brand typography using Flutter CustomPainter.
/// NO photos, NO bitmaps, NO assets. 100% manual Dart vector math on Canvas.
class OnegoLogoPainter extends CustomPainter {
  const OnegoLogoPainter({
    this.color = Colors.white,
  });

  final Color color;

  // Reference coordinate box: 742 width x 192 height
  static const double refWidth = 742.0;
  static const double refHeight = 192.0;

  @override
  void paint(Canvas canvas, Size size) {
    // Dynamically scale according to available size
    final double scale = size.width / refWidth;
    canvas.save();
    canvas.scale(scale);

    const double strokeWidth = 17.5;
    final Paint strokePaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.butt
      ..strokeJoin = StrokeJoin.round
      ..isAntiAlias = true;

    const double glyphHeight = 130.5;
    const double centerY = glyphHeight / 2; // 65.25
    const double radius = (glyphHeight - strokeWidth) / 2; // 56.5

    // -------------------------------------------------------------
    // 1. First 'o': [x: 0 .. 130.5]
    // -------------------------------------------------------------
    const double o1CenterX = 65.25;
    canvas.drawCircle(
      const Offset(o1CenterX, centerY),
      radius,
      strokePaint,
    );

    // -------------------------------------------------------------
    // 2. 'n': [x: 158 .. 284.5] (width: 126.5)
    // -------------------------------------------------------------
    const double nLeft = 158.0;
    const double nRight = nLeft + 126.5;
    final double nStemLeftX = nLeft + strokeWidth / 2;
    final double nStemRightX = nRight - strokeWidth / 2;
    final double nArchRadius = (nStemRightX - nStemLeftX) / 2;
    final double nArchCenterX = (nStemLeftX + nStemRightX) / 2;

    final Path nPath = Path();
    // Left vertical stem: bottom to arch start
    nPath.moveTo(nStemLeftX, glyphHeight);
    nPath.lineTo(nStemLeftX, centerY);
    // Top arch (semicircle from PI to 0)
    nPath.arcTo(
      Rect.fromCircle(center: Offset(nArchCenterX, centerY), radius: nArchRadius),
      math.pi,
      math.pi,
      false,
    );
    // Right vertical stem: arch end down to bottom
    nPath.lineTo(nStemRightX, glyphHeight);
    canvas.drawPath(nPath, strokePaint);

    // -------------------------------------------------------------
    // 3. 'e': [x: 309 .. 437.5] (width: 128.5)
    // -------------------------------------------------------------
    const double eLeft = 309.0;
    const double eCenterX = eLeft + 64.25;
    final Rect eRect = Rect.fromCircle(center: const Offset(eCenterX, centerY), radius: radius);

    final Path ePath = Path();
    // Horizontal crossbar across the center
    ePath.moveTo(eCenterX - radius, centerY);
    ePath.lineTo(eCenterX + radius, centerY);
    // Outer arch: sweeping from 0 counter-clockwise around to bottom open tip
    ePath.arcTo(
      eRect,
      0,
      -math.pi * 1.72,
      false,
    );
    canvas.drawPath(ePath, strokePaint);

    // -------------------------------------------------------------
    // 4. 'g': [x: 461 .. 589.5] (width: 128.5)
    // -------------------------------------------------------------
    const double gLeft = 461.0;
    const double gCenterX = gLeft + 64.25;
    // Top circular bowl
    canvas.drawCircle(
      const Offset(gCenterX, centerY),
      radius,
      strokePaint,
    );

    // Signature smile curve underneath
    final Rect smileRect = Rect.fromCircle(
      center: const Offset(gCenterX, 134.0),
      radius: radius,
    );
    final Path smilePath = Path();
    smilePath.arcTo(
      smileRect,
      0.08 * math.pi,
      0.84 * math.pi,
      false,
    );
    canvas.drawPath(smilePath, strokePaint);

    // -------------------------------------------------------------
    // 5. Second 'o': [x: 611 .. 741.5]
    // -------------------------------------------------------------
    const double o2CenterX = 611.0 + 65.25;
    canvas.drawCircle(
      const Offset(o2CenterX, centerY),
      radius,
      strokePaint,
    );

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant OnegoLogoPainter oldDelegate) =>
      oldDelegate.color != color;
}

/// A responsive widget that manually displays the Onego logo in code,
/// optically centered in the middle of the screen.
class OnegoLogo extends StatelessWidget {
  const OnegoLogo({
    super.key,
    this.width,
    this.color = Colors.white,
  });

  final double? width;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Target width: 62% of available landscape width
        final double targetWidth = width ??
            (constraints.maxWidth * 0.62).clamp(280.0, 750.0);
        final double targetHeight =
            targetWidth * (OnegoLogoPainter.refHeight / OnegoLogoPainter.refWidth);

        // The smile under 'g' extends below the text baseline by (192 - 130.5 = 61.5) px.
        // We shift the box upward by half of this descender height so that the primary text
        // characters ('o n e g o') are placed in the dead optical center of the screen.
        final double opticalOffsetY =
            (targetWidth / OnegoLogoPainter.refWidth) * (61.5 / 2);

        return Center(
          child: Transform.translate(
            offset: Offset(0, -opticalOffsetY / 2),
            child: SizedBox(
              width: targetWidth,
              height: targetHeight,
              child: CustomPaint(
                painter: OnegoLogoPainter(color: color),
              ),
            ),
          ),
        );
      },
    );
  }
}
