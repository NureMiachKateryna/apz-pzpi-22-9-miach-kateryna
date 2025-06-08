package com.example.honeyapp.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.honeyapp.data.api.RetrofitInstance
import com.example.honeyapp.data.model.UserDto
import com.example.honeyapp.data.model.HoneyBatchDto
import com.example.honeyapp.data.repository.HoneyBatchRepository
import com.example.honeyapp.data.repository.Result
import com.example.honeyapp.data.util.TokenManager
import com.google.gson.Gson
import kotlinx.coroutines.launch

class DashboardViewModel(application: Application) : AndroidViewModel(application) {

    private val tokenManager = TokenManager(application)
    private val honeyBatchRepository = HoneyBatchRepository(RetrofitInstance.honeyBatchApi)

    private val _currentUser = MutableLiveData<UserDto?>()
    val currentUser: LiveData<UserDto?> = _currentUser

    private val _recentHoneyBatches = MutableLiveData<List<HoneyBatchDto>>()
    val recentHoneyBatches: LiveData<List<HoneyBatchDto>> = _recentHoneyBatches

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    init {
        loadCurrentUserDetails()
        fetchDashboardData()
    }

    private fun loadCurrentUserDetails() {
        val userJson = tokenManager.getUserDetailsJson()
        if (userJson != null) {
            try {
                _currentUser.value = Gson().fromJson(userJson, UserDto::class.java)
            } catch (e: Exception) {
                _currentUser.value = null
                _error.value = "Помилка завантаження даних користувача"
                println("Error parsing user details from prefs: ${e.message}")
            }
        } else {
            _currentUser.value = null
        }
    }

    fun fetchDashboardData() {
        if (tokenManager.getToken() == null) {
            _error.value = "Користувач не аутентифікований"
            _isLoading.value = false
            return
        }
        _isLoading.value = true
        _error.value = null
        viewModelScope.launch {
            val batchesResult = honeyBatchRepository.getHoneyBatches()
            if (batchesResult is Result.Success) {
                _recentHoneyBatches.postValue(batchesResult.data.take(3))
            } else if (batchesResult is Result.Error) {
                _error.postValue(batchesResult.errorMessage ?: batchesResult.exception.message ?: "Помилка завантаження партій меду")
            }
            _isLoading.postValue(false)
        }
    }

    fun logout() {
        tokenManager.clearAllAuthData()
        _currentUser.value = null
        _recentHoneyBatches.value = emptyList()
    }
}