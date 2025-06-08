package com.example.honeyapp

sealed class Screen(val route: String) {
    object Login : Screen("login_screen")
    object Register : Screen("register_screen")
    object Dashboard : Screen("dashboard_screen")
    object HoneyBatches : Screen("honey_batches_screen")
    object NotificationSettings : Screen("notification_settings_screen")
}