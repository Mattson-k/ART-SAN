package com.artsan.app.domain

import kotlinx.coroutines.flow.Flow

class GetArtistsUseCase(private val repository: ArtistRepository) {
    suspend operator fun invoke(): Result<List<Artist>> = repository.getArtists()
}

class ObserveProjectsUseCase(private val repository: MuralRepository) {
    operator fun invoke(): Flow<List<MuralProject>> = repository.observeProjects()
}

class SubmitCommissionUseCase(private val repository: MuralRepository) {
    suspend operator fun invoke(project: MuralProject): Result<Unit> {
        return repository.insertProject(project)
    }
}

class UpdateProjectProgressUseCase(private val repository: MuralRepository) {
    suspend operator fun invoke(projectId: String, progress: Int): Result<Unit> {
        return repository.updateProjectProgress(projectId, progress)
    }
}

class AddCommentUseCase(private val repository: MuralRepository) {
    suspend operator fun invoke(projectId: String, comment: UserComment): Result<Unit> {
        return repository.addComment(projectId, comment)
    }
}

class ProcessPaymentUseCase(private val repository: MuralRepository) {
    suspend operator fun invoke(projectId: String, paymentType: String): Result<Unit> {
        return repository.processMilestonePayment(projectId, paymentType)
    }
}
