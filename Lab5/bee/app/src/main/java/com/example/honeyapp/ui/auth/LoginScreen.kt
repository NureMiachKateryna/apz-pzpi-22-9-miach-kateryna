package com.example.honeyapp.ui.auth

import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.honeyapp.data.model.AuthResponse
import com.example.honeyapp.data.repository.Result
import com.example.honeyapp.ui.theme.HoneyAppTheme
import com.example.honeyapp.viewmodel.LoginViewModel

@Composable
fun LoginScreen(
    loginViewModel: LoginViewModel = viewModel(),
    onLoginSuccess: () -> Unit,
    onNavigateToRegister: () -> Unit
) {
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val loginResultState by loginViewModel.loginResult.observeAsState()
    val isLoading by loginViewModel.isLoading.observeAsState(false)
    val context = LocalContext.current

    LaunchedEffect(loginResultState) {
        val currentResult = loginResultState ?: return@LaunchedEffect

        when (currentResult) {
            is Result.Success<*> -> {
                val authResponse = currentResult.data as? AuthResponse
                if (authResponse != null) {
                    Toast.makeText(context, "Вхід успішний: ${authResponse.user.username}", Toast.LENGTH_LONG).show()
                    onLoginSuccess()
                } else {
                    Toast.makeText(context, "Помилка: Неправильний тип відповіді від сервера після логіну", Toast.LENGTH_LONG).show()
                }
            }
            is Result.Error -> {
                val errorMessage = currentResult.errorMessage ?: currentResult.exception.localizedMessage ?: "Невідома помилка входу"
                Toast.makeText(context, "Помилка входу: $errorMessage", Toast.LENGTH_LONG).show()
            }
        }

    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 24.dp, vertical = 16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Вхід до HoneyTrack",
            style = MaterialTheme.typography.headlineLarge,
            color = MaterialTheme.colorScheme.primary
        )
        Spacer(modifier = Modifier.height(32.dp))

        OutlinedTextField(
            value = username,
            onValueChange = { username = it },
            label = { Text("Ім'я користувача") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text)
        )
        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Пароль") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password)
        )
        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = {
                if (!isLoading) {
                    loginViewModel.login(username, password)
                }
            },
            enabled = !isLoading,
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(24.dp),
                    color = MaterialTheme.colorScheme.onPrimary,
                    strokeWidth = 3.dp
                )
            } else {
                Text("Увійти", style = MaterialTheme.typography.labelLarge)
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
    }
}

@Preview(showBackground = true, widthDp = 320, heightDp = 640)
@Composable
fun LoginScreenPreview() {
    HoneyAppTheme {
        LoginScreen(
            onLoginSuccess = { println("Preview: Login Success") },
            onNavigateToRegister = { println("Preview: Navigate to Register") }
        )
    }
}
