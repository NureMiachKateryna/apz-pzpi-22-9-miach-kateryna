package com.example.honeyapp.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat


private val AppLightColorScheme = lightColorScheme(
    primary = HoneyGold,
    onPrimary = DarkBrownText,
    primaryContainer = HoneyCream,
    onPrimaryContainer = DarkBrownText,
    secondary = ForestGreen,
    onSecondary = White,
    secondaryContainer = LightGreenAccent,
    onSecondaryContainer = DarkBrownText,
    tertiary = MediumBrown,
    onTertiary = White,
    error = ErrorRed,
    onError = White,
    background = HoneyPageBackground,
    onBackground = DarkBrownText,
    surface = HoneyCream,
    onSurface = DarkBrownText,
    surfaceVariant = HoneyCream,
    onSurfaceVariant = DarkBrownText,
    outline = MediumBrown
)


@Composable
fun HoneyAppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        else -> AppLightColorScheme
    }
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window
            window?.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view)?.isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}