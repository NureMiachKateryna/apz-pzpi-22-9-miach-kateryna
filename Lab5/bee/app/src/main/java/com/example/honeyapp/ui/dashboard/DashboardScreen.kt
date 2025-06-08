package com.example.honeyapp.ui.dashboard

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ExitToApp
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.honeyapp.data.model.HoneyBatchDto
import com.example.honeyapp.ui.theme.HoneyAppTheme
import com.example.honeyapp.viewmodel.DashboardViewModel
import java.text.SimpleDateFormat
import java.util.Locale
import java.util.TimeZone

fun formatDateDashboard(dateString: String?): String {
    if (dateString.isNullOrBlank()) return "N/A"
    return try {
        val inputFormat = if (dateString.contains("T")) {
            SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
        } else {
            SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        }
        inputFormat.timeZone = TimeZone.getTimeZone("UTC")
        val date = inputFormat.parse(dateString)
        val outputFormat = SimpleDateFormat("dd.MM.yyyy", Locale.getDefault())
        outputFormat.timeZone = TimeZone.getDefault()
        date?.let { outputFormat.format(it) } ?: dateString
    } catch (e: Exception) {
        dateString
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    dashboardViewModel: DashboardViewModel = viewModel(),
    onLogout: () -> Unit,
    onNavigateToHoneyBatches: () -> Unit,
    onNavigateToNotificationSettings: () -> Unit
) {
    val currentUser by dashboardViewModel.currentUser.observeAsState()
    val recentHoneyBatches by dashboardViewModel.recentHoneyBatches.observeAsState(emptyList())
    val isLoading by dashboardViewModel.isLoading.observeAsState(false)
    val error by dashboardViewModel.error.observeAsState()

    LaunchedEffect(key1 = currentUser) {
        if (currentUser != null) {
            dashboardViewModel.fetchDashboardData()
        }
    }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("HoneyApp Дашборд", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer, // Світло-жовтий фон
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                ),
                actions = {
                    IconButton(onClick = {
                        dashboardViewModel.logout()
                        onLogout()
                    }) {
                        Icon(Icons.AutoMirrored.Filled.ExitToApp, contentDescription = "Вихід", tint = MaterialTheme.colorScheme.onPrimaryContainer)
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            if (isLoading && currentUser == null && recentHoneyBatches.isEmpty()) {
                CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
            } else {
                currentUser?.let { user ->
                    Text(
                        text = "Вітаємо, ${user.username}!",
                        style = MaterialTheme.typography.headlineSmall,
                        color = MaterialTheme.colorScheme.onBackground,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )
                }

                if (error != null) {
                    Text(
                        text = "Помилка: $error",
                        color = MaterialTheme.colorScheme.error,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )
                }

                ElevatedCard(
                    modifier = Modifier.fillMaxWidth(),
                    onClick = onNavigateToHoneyBatches,
                    colors = CardDefaults.elevatedCardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column(modifier = Modifier.padding(16.dp).fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                Icons.Filled.List,
                                contentDescription = "Партії меду",
                                modifier = Modifier.size(36.dp).padding(end = 8.dp),
                                tint = MaterialTheme.colorScheme.primary
                            )
                            Text("Партії Меду", style = MaterialTheme.typography.titleLarge)
                        }
                        Text(
                            "${recentHoneyBatches.size}",
                            style = MaterialTheme.typography.displaySmall,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.padding(vertical = 8.dp)
                        )
                        Text("Загальна кількість", style = MaterialTheme.typography.bodyMedium)
                    }
                }

                if (recentHoneyBatches.isNotEmpty()) {
                    Card(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("Останні додані партії:", style = MaterialTheme.typography.titleMedium)
                            Spacer(modifier = Modifier.height(12.dp))
                            recentHoneyBatches.forEach { batch ->
                                RecentHoneyBatchItem(batch)
                                Divider(modifier = Modifier.padding(vertical = 6.dp), color = MaterialTheme.colorScheme.outlineVariant)
                            }
                        }
                    }
                } else if (!isLoading) {
                    Card(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("Партій меду ще немає", style = MaterialTheme.typography.bodyLarge)
                            Spacer(modifier = Modifier.height(8.dp))
                            Button(onClick = onNavigateToHoneyBatches) {
                                Text("Додати першу партію")
                            }
                        }
                    }
                }


                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Button(
                        onClick = { dashboardViewModel.fetchDashboardData() },
                        enabled = !isLoading,
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary)
                    ) {
                        Text(if(isLoading && recentHoneyBatches.isNotEmpty()) "Оновлення..." else "Оновити дані")
                    }
                    Button(
                        onClick = onNavigateToNotificationSettings,
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.tertiary)
                    ) {
                        Icon(Icons.Filled.Settings, contentDescription = "Налаштування", modifier = Modifier.size(ButtonDefaults.IconSize))
                        Spacer(modifier = Modifier.size(ButtonDefaults.IconSpacing))
                        Text("Налаштування")
                    }
                }
            }
        }
    }
}

@Composable
fun RecentHoneyBatchItem(batch: HoneyBatchDto) {
    Column(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
        Text(batch.name, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Medium, color = MaterialTheme.colorScheme.primary)
        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()){
            Text("Сорт: ${batch.sort ?: "N/A"}", style = MaterialTheme.typography.bodyMedium)
            Text("К-сть: ${batch.quantity ?: 0.0} ${batch.unit ?: ""}", style = MaterialTheme.typography.bodyMedium)
        }
        Text("Збір: ${formatDateDashboard(batch.collectionDate)}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Preview(showBackground = true)
@Composable
fun DashboardScreenPreview() {
    HoneyAppTheme {
        DashboardScreen(onLogout = {}, onNavigateToHoneyBatches = {}, onNavigateToNotificationSettings = {})
    }
}