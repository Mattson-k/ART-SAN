import SwiftUI
import Observation

// Type-Safe enum destinations for app screen routing
enum Destination: Hashable {
    case marketplace
    case projectDetails(String) // project ID
    case commissionForm
    case complianceCenter
}

@Observable
final class Router {
    var path = NavigationPath()
    var currentTab: String = "marketplace"
    
    func navigate(to destination: Destination) {
        path.append(destination)
    }
    
    func popToRoot() {
        path = NavigationPath()
    }
}
