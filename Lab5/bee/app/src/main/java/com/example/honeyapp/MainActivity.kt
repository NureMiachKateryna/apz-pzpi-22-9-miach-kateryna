// MainActivity.kt
package com.example.honeyapp

import androidx.compose.material3.Text
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.honeyapp.ui.auth.LoginScreen
import com.example.honeyapp.ui.dashboard.DashboardScreen
import com.example.honeyapp.ui.theme.HoneyAppTheme
import com.example.honeyapp.data.util.TokenManager
import androidx.lifecycle.ViewModelProvider
import com.example.honeyapp.viewmodel.DashboardViewModel
import com.example.honeyapp.data.api.RetrofitInstance
import com.example.honeyapp.ui.honeybatches.HoneyBatchesScreen

class MainActivity : ComponentActivity() {
    private lateinit var tokenManager: TokenManager
    private lateinit var dashboardViewModel: DashboardViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        tokenManager = TokenManager(applicationContext)
        RetrofitInstance.initializeAuthInterceptor(tokenManager)
        dashboardViewModel = ViewModelProvider(this)[DashboardViewModel::class.java]

        setContent {
            HoneyAppTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    AppNavigation(tokenManager = tokenManager, dashboardViewModel = dashboardViewModel)
                }
            }
        }
    }
}

@Composable
fun AppNavigation(tokenManager: TokenManager, dashboardViewModel: DashboardViewModel) {
    val navController = rememberNavController()
    val startDestination = if (tokenManager.getToken() != null) Screen.Dashboard.route else Screen.Login.route

    NavHost(navController = navController, startDestination = startDestination) {
        composable(Screen.Login.route) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(Screen.Dashboard.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                        launchSingleTop = true
                    }
                },
                onNavigateToRegister = {
                    navController.navigate(Screen.Register.route)
                }
            )
        }
        composable(Screen.Dashboard.route) {
            DashboardScreen(
                dashboardViewModel = dashboardViewModel,
                onLogout = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Dashboard.route) { inclusive = true }
                        launchSingleTop = true
                    }
                },
                onNavigateToHoneyBatches = {
                    navController.navigate(Screen.HoneyBatches.route)
                },
                onNavigateToNotificationSettings = {
                    navController.navigate(Screen.NotificationSettings.route)
                }
            )
        }
        composable(Screen.HoneyBatches.route) {
            HoneyBatchesScreen(navController = navController)
        }
        composable(Screen.NotificationSettings.route) {
            Text("Notification Settings Screen Placeholder")
        }
    }
}