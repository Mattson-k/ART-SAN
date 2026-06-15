import Foundation

// Identifiable models for SwiftUI List collections
struct Artist: Identifiable, Hashable {
    let id: String
    let name: String
    let avatarUrl: String
    let location: String
    let style: String
    let rating: Double
    let reviewsCount: Int
    let priceRange: String
    let bio: String
    let portfolioUrls: [String]
}

struct MuralProject: Identifiable, Equatable {
    let id: String
    var title: String
    var businessName: String
    var address: String
    var artistId: String
    var artistName: String
    var style: String
    var dimensions: String
    var budget: Double
    var targetDate: String
    var status: ProjectStatus
    var progress: Int
    var timeline: [Milestone]
    var updates: [UserComment]
    var muralImageUrl: String
    var isDepositPaid: Bool
    var isFinalPaid: Bool
    
    static func == (lhs: MuralProject, rhs: MuralProject) -> Bool {
        return lhs.id == rhs.id && lhs.progress == rhs.progress && lhs.status == rhs.status
    }
}

enum ProjectStatus: String, CaseIterable {
    case request = "REQUEST"
    case active = "ACTIVE"
    case completed = "COMPLETED"
}

struct Milestone: Hashable {
    var name: String
    var description: String
    var status: MilestoneStatus
}

enum MilestoneStatus: String {
    case pending = "PENDING"
    case current = "CURRENT"
    case done = "DONE"
}

struct UserComment: Identifiable, Hashable {
    var id = UUID()
    var user: String
    var time: String
    var text: String
}
