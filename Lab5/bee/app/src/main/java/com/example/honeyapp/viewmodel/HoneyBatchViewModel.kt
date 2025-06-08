package com.example.honeyapp.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.honeyapp.data.api.RetrofitInstance
import com.example.honeyapp.data.model.HoneyBatchDto
import com.example.honeyapp.data.repository.HoneyBatchRepository
import com.example.honeyapp.data.repository.Result
import com.example.honeyapp.data.util.TokenManager
import kotlinx.coroutines.launch

class HoneyBatchViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = HoneyBatchRepository(RetrofitInstance.honeyBatchApi)
    private val tokenManager = TokenManager(application)

    private val _honeyBatches = MutableLiveData<List<HoneyBatchDto>>()
    val honeyBatches: LiveData<List<HoneyBatchDto>> = _honeyBatches

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    fun fetchHoneyBatches() {
        if (tokenManager.getToken() == null) {
            _error.value = "Користувач не аутентифікований для завантаження партій меду."
            return
        }
        _isLoading.value = true
        _error.value = null
        viewModelScope.launch {
            val result = repository.getHoneyBatches()
            if (result is Result.Success) {
                _honeyBatches.postValue(result.data)
            } else if (result is Result.Error) {
                _error.postValue(result.errorMessage ?: result.exception.localizedMessage ?: "Не вдалося завантажити партії меду")
            }
            _isLoading.postValue(false)
        }
    }

}