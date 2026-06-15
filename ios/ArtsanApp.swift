import SwiftUI

@main
struct ArtsanApp: App {
    @State private var router = Router()
    
    init() {
        // Customize global bar colors for premium Obsidian look
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor(ThemeColors.obsidianBg)
        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
    }
    
    var body: some Scene {
        WindowGroup {
            TabView(selection: $router.currentTab) {
                NavigationStack(path: $router.path) {
                    MarketplaceView()
                        .navigationTitle("Artsan Art")
                }
                .tabItem {
                    Label("Marketplace", systemImage: "paintpalette.fill")
                }
                .tag("marketplace")
                
                NavigationStack {
                    ProjectWorkspaceView()
                        .navigationTitle("Collaboration Board")
                }
                .tabItem {
                    Label("Workspace", systemImage: "briefcase.fill")
                }
                .tag("workspace")
            }
            .environment(router)
            .preferredColorScheme(.dark)
        }
    }
}
