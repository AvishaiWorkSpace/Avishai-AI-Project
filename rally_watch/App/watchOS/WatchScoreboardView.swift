import SwiftUI
import PadelScoreKit

/// The whole watch experience: a compact sets/games strip on top, then two big
/// tappable zones — tap your side to add a point. Long-press for undo / new match.
struct WatchScoreboardView: View {
    @EnvironmentObject var vm: MatchViewModel
    @State private var showSetup = false

    var body: some View {
        let s = vm.state
        ZStack {
            VStack(spacing: 3) {
                setsStrip(s)
                teamZone(.a)
                teamZone(.b)
            }
            if s.finished { finishedOverlay(s) }
        }
        .ignoresSafeArea(edges: .bottom)
        .contextMenu {
            Button { vm.undo() } label: { Label("בטל נקודה", systemImage: "arrow.uturn.backward") }
                .disabled(!vm.canUndo)
            Button { showSetup = true } label: { Label("משחק חדש", systemImage: "plus.circle") }
        }
        .sheet(isPresented: $showSetup) { WatchSetupView().environmentObject(vm) }
    }

    // MARK: Sets / games strip

    private func setsStrip(_ s: MatchState) -> some View {
        HStack(spacing: 6) {
            ForEach(Array(s.completedSets.enumerated()), id: \.offset) { _, set in
                Text("\(set.games[0])-\(set.games[1])")
                    .foregroundStyle(.secondary)
            }
            Text("\(s.games[0])-\(s.games[1])")
                .fontWeight(.bold)
                .foregroundStyle(Color.rallyGoldLight)
        }
        .font(.system(size: 13, design: .rounded))
        .lineLimit(1)
        .minimumScaleFactor(0.7)
        .padding(.top, 2)
    }

    // MARK: One team's tap zone

    private func teamZone(_ team: Team) -> some View {
        Button {
            vm.award(team)
        } label: {
            HStack {
                VStack(alignment: .leading, spacing: 1) {
                    HStack(spacing: 4) {
                        if vm.isServing(team) {
                            Circle().fill(Color.rallyGold).frame(width: 6, height: 6)
                        }
                        Text(vm.name(team))
                            .font(.system(size: 13, weight: .semibold))
                            .lineLimit(1)
                            .minimumScaleFactor(0.7)
                    }
                    Text("גיימים \(vm.state.games[team.rawValue])")
                        .font(.system(size: 10))
                        .foregroundStyle(.white.opacity(0.6))
                }
                Spacer()
                Text(vm.pointLabel(team))
                    .font(.system(size: 40, weight: .black, design: .rounded))
                    .monospacedDigit()
                    .minimumScaleFactor(0.6)
                    .lineLimit(1)
            }
            .padding(.horizontal, 12)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(team == .a ? Color.rallyBrand : Color.rallyBrandDeep)
            .foregroundStyle(.white)
        }
        .buttonStyle(.plain)
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
    }

    // MARK: Finished

    private func finishedOverlay(_ s: MatchState) -> some View {
        VStack(spacing: 8) {
            Text("סיום משחק")
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(.white.opacity(0.7))
            Text(vm.name(s.winner ?? .a))
                .font(.system(size: 22, weight: .black, design: .rounded))
                .foregroundStyle(Color.rallyGold)
            Text(ScoreEngine.summary(s))
                .font(.system(size: 13, design: .rounded))
                .foregroundStyle(.white)
            Button("משחק חדש") { showSetup = true }
                .tint(Color.rallyGold)
        }
        .padding()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(.ultraThinMaterial)
    }
}
