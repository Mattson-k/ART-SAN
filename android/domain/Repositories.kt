package com.artsan.app.domain

import kotlinx.coroutines.flow.Flow

interface ArtistRepository {
    suspend fun getArtists(): Result<List<Artist>>
    suspend fun getArtistById(id: String): Result<Artist?>
}

interface MuralRepository {
    fun observeProjects(): Flow<List<MuralProject>>
    suspend fun getProjectById(id: String): Result<MuralProject?>
    suspend fun insertProject(project: MuralProject): Result<Unit>
    suspend fun updateProjectProgress(projectId: String, progress: Int): Result<Unit>
    suspend fun addComment(projectId: String, comment: UserComment): Result<Unit>
    suspend fun processMilestonePayment(projectId: String, paymentType: String): Result<Unit>
}
