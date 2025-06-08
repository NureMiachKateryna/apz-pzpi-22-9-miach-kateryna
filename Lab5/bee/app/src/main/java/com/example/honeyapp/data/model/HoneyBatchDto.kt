package com.example.honeyapp.data.model

import android.os.Parcelable
import com.google.gson.annotations.SerializedName
import kotlinx.parcelize.Parcelize

@Parcelize
data class HoneyBatchDto(
    @SerializedName("batch_id")
    val batchId: Int,
    @SerializedName("user_id")
    val userId: Int,
    val name: String,
    val sort: String?,
    val quantity: Double?,
    val unit: String?,
    @SerializedName("collection_date")
    val collectionDate: String?,
    val notes: String?,
    @SerializedName("storage_location_id")
    val storageLocationId: Int?,
    @SerializedName("StorageLocation")
    val storageLocation: StorageLocationDto?,
    val createdAt: String,
    val updatedAt: String
) : Parcelable

@Parcelize
data class StorageLocationDto(
    @SerializedName("location_id")
    val locationId: Int,
    val name: String?
) : Parcelable