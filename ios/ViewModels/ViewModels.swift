import Foundation
import Observation

@Observable
final class MarketplaceViewModel {
    private(set) var artists: [Artist] = []
    private(set) var isLoading = false
    var searchText = ""
    var selectedStyle = "All"
    
    init() {
        mockLoadArtists()
    }
    
    func mockLoadArtists() {
        isLoading = true
        // Simulating network delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            self.artists = [
                Artist(
                    id: "art-1",
                    name: "Jessica Davis",
                    avatarUrl: "assets/artist_avatar_1.png",
                    location: "Brooklyn, NY",
                    style: "Botanical",
                    rating: 4.9,
                    reviewsCount: 28,
                    priceRange: "$1,200 - $3,500",
                    bio: "Specializing in oversized botanical storefront murals that bring organic warmth.",
                    portfolioUrls: ["assets/mural_botanical.png", "assets/mural_realism.png"]
                ),
                Artist(
                    id: "art-2",
                    name: "Marcus Vance",
                    avatarUrl: "assets/artist_avatar_2.png",
                    location: "Queens, NY",
                    style: "Abstract",
                    rating: 4.8,
                    reviewsCount: 34,
                    priceRange: "$1,500 - $4,000",
                    bio: "Focused on high-contrast geometric abstractions.",
                    portfolioUrls: ["assets/mural_abstract.png", "assets/mural_botanical.png"]
                )
            ]
            self.isLoading = false
        }
    }
}

@Observable
final class WorkspaceViewModel {
    var projects: [MuralProject] = []
    var activeProject: MuralProject?
    var activeRole: String = "business" // "business" | "artist"
    var isStripeSheetOpen = false
    var activeCheckoutType = "deposit" // "deposit" | "final"
    
    init() {
        mockLoadProjects()
    }
    
    func mockLoadProjects() {
        let initialTimeline = [
            Milestone(name: "Initial Design Approval", description: "Design sketch and permit review.", status: .done),
            Milestone(name: "Milestone Deposit Paid", description: "50% Stripe payment escrow complete.", status: .done),
            Milestone(name: "Surface Preparation", description: "Wall paint primer outline.", status: .done),
            Milestone(name: "Color Fill & Painting", description: "Spray and brush execution in progress.", status: .current),
            Milestone(name: "Final Client Inspection", description: "Owner sign-off and sealing.", status: .pending)
        ]
        
        let initialUpdates = [
            UserComment(user: "Elena Rostova", time: "2 hours ago", text: "Finished main leaves overlay. Detail matches original proposal."),
            UserComment(user: "The Tiger Den", time: "Yesterday", text: "Looks amazing! Love the neon shadows.")
        ]
        
        let initialProj = MuralProject(
            id: "proj-101",
            title: "Majestic Tiger Facade Painting",
            businessName: "The Tiger's Den",
            address: "142 Bedford Ave, Brooklyn NY",
            artistId: "art-1",
            artistName: "Jessica Davis",
            style: "Realism",
            dimensions: "12ft x 18ft",
            budget: 2500.0,
            targetDate: "2026-06-28",
            status: .active,
            progress: 65,
            timeline: initialTimeline,
            updates: initialUpdates,
            muralImageUrl: "assets/mural_realism.png",
            isDepositPaid: true,
            isFinalPaid: false
        )
        
        self.projects = [initialProj]
        self.activeProject = initialProj
    }
    
    func selectProject(_ project: MuralProject) {
        self.activeProject = project
    }
    
    func updateProgress(projectId: String, progress: Int) {
        guard let idx = projects.firstIndex(where: { $0.id == projectId }) else { return }
        projects[idx].progress = progress
        
        // Adjust milestone statuses based on progress thresholds
        if progress >= 100 {
            projects[idx].timeline[4].status = .done
        } else if progress >= 90 {
            projects[idx].timeline[3].status = .done
            projects[idx].timeline[4].status = .current
        } else if progress >= 30 {
            projects[idx].timeline[2].status = .done
            projects[idx].timeline[3].status = .current
        }
        
        projects[idx].updates.insert(
            UserComment(user: projects[idx].artistName, time: "Just now", text: "Updated installation execution progress to \(progress)%."),
            at: 0
        )
        
        // Refresh active ref
        self.activeProject = projects[idx]
    }
    
    func postComment(projectId: String, text: String, sender: String) {
        guard let idx = projects.firstIndex(where: { $0.id == projectId }) else { return }
        projects[idx].updates.insert(
            UserComment(user: sender, time: "Just now", text: text),
            at: 0
        )
        self.activeProject = projects[idx]
    }
    
    func executeStripePayment(projectId: String) {
        guard let idx = projects.firstIndex(where: { $0.id == projectId }) else { return }
        if activeCheckoutType == "deposit" {
            projects[idx].isDepositPaid = true
            projects[idx].status = .active
            projects[idx].timeline[1].status = .done
            projects[idx].timeline[2].status = .current
            projects[idx].updates.insert(
                UserComment(user: "Stripe Escrow", time: "Just now", text: "Payment of deposit successful. Materials secured."),
                at: 0
            )
        } else {
            projects[idx].isFinalPaid = true
            projects[idx].status = .completed
            projects[idx].timeline[4].status = .done
            projects[idx].updates.insert(
                UserComment(user: "Stripe Escrow", time: "Just now", text: "Final milestone released. Project marked completed."),
                at: 0
            )
        }
        self.activeProject = projects[idx]
        self.isStripeSheetOpen = false
    }
}
