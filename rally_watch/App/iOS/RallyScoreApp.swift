import SwiftUI
import PadelScoreKit

@main
struct RallyScoreApp: App {
    @StateObject private var vm = MatchViewModel()

    init() {
        // Wire the match result to your Base44 data center. Use the same App ID
        // as the web app's VITE_BASE44_APP_ID. Leave nil to stay offline.
        Task { await RallyAPI.shared.configure(appId: nil) }
    }

    var body: some Scene {
        WindowGroup {
            RootView().environmentObject(vm)
        }
    }
}

struct RootView: View {
    @EnvironmentObject var vm: MatchViewModel
    @State private var playing = false

    var body: some View {
        NavigationStack {
            MatchSetupView(onStart: { playing = true })
                .navigationDestination(isPresented: $playing) {
                    ScoreboardView()
                }
        }
        .tint(.rallyBrand)
    }
}
