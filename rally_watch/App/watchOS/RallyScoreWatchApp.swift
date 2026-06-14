import SwiftUI
import PadelScoreKit

@main
struct RallyScoreWatchApp: App {
    @StateObject private var vm = MatchViewModel()

    var body: some Scene {
        WindowGroup {
            WatchScoreboardView()
                .environmentObject(vm)
        }
    }
}
