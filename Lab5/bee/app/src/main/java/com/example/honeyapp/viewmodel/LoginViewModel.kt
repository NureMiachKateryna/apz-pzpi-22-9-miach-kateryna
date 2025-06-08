package com.example.honeyapp.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.honeyapp.data.api.RetrofitInstance
import com.example.honeyapp.data.model.AuthRequest
import com.example.honeyapp.data.model.AuthResponse
import com.example.honeyapp.data.repository.AuthRepository
import com.example.honeyapp.data.repository.Result
import com.example.honeyapp.data.util.TokenManager
import kotlinx.coroutines.launch

class LoginViewModel(application: Application) : AndroidViewModel(application) {

    private val authRepository = AuthRepository(RetrofitInstance.authApi)
    private val tokenManager = TokenManager(application)

    private val _loginResult = MutableLiveData<Result<AuthResponse>>()
    val loginResult: LiveData<Result<AuthResponse>> = _loginResult

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    fun login(username: String, password: String) {
        if (username.isBlank() || password.isBlank()) {
            _loginResult.value = Result.Error(IllegalArgumentException("Ім'я користувача та пароль не можуть бути порожніми"))
            return
        }

        _isLoading.value = true
        viewModelScope.launch {
            val result = authRepository.loginUser(AuthRequest(username, password))
            if (result is Result.Success) {
                tokenManager.saveToken(result.data.token)
                tokenManager.saveUserDetails(result.data.user)
            }
            _loginResult.postValue(result)
            _isLoading.postValue(false)
        }
    }

    fun handleSuccessfulLogin(authResponse: AuthResponse) {
        tokenManager.saveToken(authResponse.token)
        println("Token saved: ${authResponse.token.take(10)}...")
        println("User logged in: ${authResponse.user.username}")
}
}