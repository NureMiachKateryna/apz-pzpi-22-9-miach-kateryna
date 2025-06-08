package com.example.honeyapp.ui.honeybatches

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import com.example.honeyapp.data.model.HoneyBatchDto
import com.example.honeyapp.ui.theme.HoneyAppTheme
import com.example.honeyapp.viewmodel.HoneyBatchViewModel
import java.text.SimpleDateFormat
import java.util.Locale
import java.util.TimeZone

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HoneyBatchesScreen(
    navController: NavHostController,
    honeyBatchViewModel: HoneyBatchViewModel = viewModel()
) {
    val batches by honeyBatchViewModel.honeyBatches.observeAsState(emptyList())
    val isLoading by honeyBatchViewModel.isLoading.observeAsState(false)
    val error by honeyBatchViewModel.error.observeAsState()

    LaunchedEffect(Unit) {
        honeyBatchViewModel.fetchHoneyBatches()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Мої Партії Меду") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = "Назад")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = { /* TODO: Навігація на екран додавання */ }) {
                Icon(Icons.Filled.Add, contentDescription = "Додати партію")
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
        ) {
            if (isLoading && batches.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator()
                }
            } else if (error != null) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Помилка: $error", color = MaterialTheme.colorScheme.error)
                }
            } else if (batches.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("У вас ще немає партій меду. Натисніть '+' щоб додати.")
                }
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(batches) { batch ->
                        HoneyBatchItem(batch = batch, onEdit = { /*TODO*/ }, onDelete = { /*TODO*/ })
                    }
                }
            }
        }
    }
}

@Composable
fun HoneyBatchItem(batch: HoneyBatchDto, onEdit: (HoneyBatchDto) -> Unit, onDelete: (Int) -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = batch.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(4.dp))
            batch.sort?.let { Text("Сорт: $it", style = MaterialTheme.typography.bodyMedium) }
            batch.quantity?.let { Text("Кількість: $it ${batch.unit ?: ""}", style = MaterialTheme.typography.bodyMedium) }
            batch.collectionDate?.let {
                Text("Дата збору: $it", style = MaterialTheme.typography.bodyMedium)
            }
            batch.storageLocation?.name?.let { Text("Місце: $it", style = MaterialTheme.typography.bodyMedium) }
            batch.notes?.let { Text("Нотатки: $it", style = MaterialTheme.typography.bodySmall) }
            Spacer(modifier = Modifier.height(8.dp))
            Row {
                Button(onClick = { onEdit(batch) }, modifier = Modifier.weight(1f)) {
                    Text("Редагувати")
                }
                Spacer(modifier = Modifier.width(8.dp))
                Button(
                    onClick = { onDelete(batch.batchId) },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error),
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Видалити")
                }
            }
        }
    }
}


fun formatDate(dateString: String?): String {
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
        date?.let { outputFormat.format(it) } ?: "N/A"
    } catch (e: Exception) {
        dateString
    }
}


@Preview(showBackground = true)
@Composable
fun HoneyBatchesScreenPreview() {
    HoneyAppTheme {
        val navController = rememberNavController()
        HoneyBatchesScreen(navController = navController)
    }
}