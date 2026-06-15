package com.artsan.app.domain

import java.util.Date

// Domain representations of Artists
data class Artist(
    val id: String,
    val name: String,
    val avatarUrl: String,
    val location: String,
    val style: String,
    val rating: Double,
    val reviewsCount: Int,
    val priceRange: String,
    val bio: String,
    val portfolioUrls: List<String>
)

// Domain representations of Mural Projects
data class MuralProject(
    val id: String,
    val title: String,
    val businessName: String,
    val address: String,
    val artistId: String,
    val artistName: String,
    val style: String,
    val dimensions: String,
    val budget: Double,
    val targetDate: String,
    val status: ProjectStatus,
    val progress: Int,
    val timeline: List<Milestone>,
    val updates: List<UserComment>,
    val muralImageUrl: String,
    val isDepositPaid: Boolean,
    val isFinalPaid: Boolean
)

enum class ProjectStatus {
    REQUEST, ACTIVE, COMPLETED
}

// Project Milestones
data class Milestone(
    val name: String,
    val description: String,
    val status: MilestoneStatus
)

enum class MilestoneStatus {
    PENDING, CURRENT, DONE
}

// Workspace comments / feeds
data class UserComment(
    val user: String,
    val time: String,
    val text: String
)

// Clean Architecture Sealed Error Wrapper
sealed interface AppError {
    data class NetworkError(val message: String) : AppError
    data class DatabaseError(val message: String) : AppError
    data class PaymentDeclined(val message: String) : AppError
    data object Unauthorized : AppError
}
