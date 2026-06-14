import SwiftUI
import PadelScoreKit

/// The phone scoreboard — mirrors the watch live (either device can score).
/// Big tap zones, a set-by-set history, undo, and a finish state.
struct ScoreboardView: View {
    @EnvironmentObject var vm: MatchViewModel
    @ObservedObject private var connectivity = ConnectivityManager.shared

    var body: some View {
        let s = vm.state
        VStack(spacing: 12) {
            historyStrip(s)
            teamZone(.a)
            teamZone(.b)
            controls(s)
        }
        .padding()
        .background(Color.rallyIvory.ignoresSafeArea())
        .navigationTitle(reachabilityTitle)
        .navigationBarTitleDisplayMode(.inline)
        .environment(\.layoutDirection, .rightToLeft)
        .overlay { if s.finished { finishedCard(s) } }
    }

    private var reachabilityTitle: String {
        connectivity.isReachable ? "מסונכרן עם השעון ●" : "מקומי"
    }

    // MARK: History

    private func historyStrip(_ s: MatchState) -> some View {
        HStack(spacing: 10) {
            ForEach(Array(s.completedSets.enumerated()), id: \.offset) { _, set in
                VStack(spacing: 2) {
                    Text("\(set.games[0])")
                    Divider().frame(width: 22)
                    Text("\(set.games[1])")
                }
                .font(.system(.body, design: .rounded).weight(.semibold))
                .foregroundStyle(.secondary)
            }
            if s.sets != [0, 0] || !s.completedSets.isEmpty {
                Text("סטים \(s.sets[0])–\(s.sets[1])")
                    .font(.caption).foregroundStyle(.secondary)
            }
            Spacer()
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    // MARK: Tap zone

    private func teamZone(_ team: Team) -> some View {
        Button { vm.award(team) } label: {
            HStack {
                VStack(alignment: .leading, spacing: 6) {
                    HStack(spacing: 6) {
                        if vm.isServing(team) {
                            Circle().fill(Color.rallyGold).frame(width: 10, height: 10)
                        }
                        Text(vm.name(team))
                            .font(.title3.weight(.bold))
                    }
                    Text("גיימים \(vm.state.games[team.rawValue])")
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.7))
                }
                Spacer()
                Text(vm.pointLabel(team))
                    .font(.system(size: 72, weight: .black, design: .rounded))
                    .monospacedDigit()
                    .minimumScaleFactor(0.5)
                    .lineLimit(1)
            }
            .padding(.horizontal, 22)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(team == .a ? Color.rallyBrand : Color.rallyBrandDeep)
            .foregroundStyle(.white)
            .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
        }
        .buttonStyle(.plain)
    }

    // MARK: Controls

    private func controls(_ s: MatchState) -> some View {
        HStack(spacing: 12) {
            Button {
                vm.undo()
            } label: {
                Label("בטל", systemImage: "arrow.uturn.backward")
                    .frame(maxWidth: .infinity).padding(.vertical, 12)
            }
            .background(Color.white)
            .clipShape(Capsule())
            .disabled(!vm.canUndo)
        }
    }

    // MARK: Finished

    private func finishedCard(_ s: MatchState) -> some View {
        VStack(spacing: 14) {
            Text("המשחק הסתיים")
                .font(.headline).foregroundStyle(.secondary)
            Text(vm.name(s.winner ?? .a))
                .font(.system(size: 34, weight: .black, design: .rounded))
                .foregroundStyle(Color.rallyBrand)
            Text(ScoreEngine.summary(s))
                .font(.title3.weight(.semibold))
            Text("התוצאה נשלחה ל-Rally")
                .font(.footnote).foregroundStyle(.secondary)
        }
        .padding(28)
        .background(Color.rallyIvory)
        .clipShape(RoundedRectangle(cornerRadius: 28, style: .continuous))
        .shadow(radius: 24, y: 8)
        .padding(40)
    }
}
