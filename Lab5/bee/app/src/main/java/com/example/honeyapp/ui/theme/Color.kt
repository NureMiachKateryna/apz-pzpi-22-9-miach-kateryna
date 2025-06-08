// ui/theme/Color.kt
package com.example.honeyapp.ui.theme
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color

val HoneyGold = Color(0xFFFFC107)
val HoneyGoldDark = Color(0xFFFFA000)
val HoneyCream = Color(0xFFFFF8E1)
val HoneyPageBackground = Color(0xFFFFFDF5)

val ForestGreen = Color(0xFF388E3C)
val LightGreenAccent = Color(0xFFAED581)

val DarkBrownText = Color(0xFF5D4037)
val MediumBrown = Color(0xFF8D6E63)
val White = Color(0xFFFFFFFF)
val Black = Color(0xFF000000)
val ErrorRed = Color(0xFFD32F2F)


val LightAppColors = lightColorScheme(
    primary = HoneyGold,
    onPrimary = DarkBrownText,
    primaryContainer = HoneyCream,
    onPrimaryContainer = DarkBrownText,
    secondary = ForestGreen,
    onSecondary = Color.White,
    secondaryContainer = LightGreenAccent,
    onSecondaryContainer = DarkBrownText,
    tertiary = MediumBrown,
    onTertiary = Color.White,
    error = ErrorRed,
    onError = Color.White,
    background = HoneyPageBackground,
    onBackground = DarkBrownText,
    surface = HoneyCream,
    onSurface = DarkBrownText,
    surfaceVariant = Color(0xFFFFF5E0),
    onSurfaceVariant = DarkBrownText,
    outline = MediumBrown
)
