import Foundation
import SwiftUI
import PadelScoreKit

#if os(watchOS)
import WatchKit
#endif

/// Drives the UI on both platforms. Owns the current `MatchState`, an undo stack,
/// and the wiring to the paired device + Base44. Awarding a point here updates
/// the local state, fires haptics on the watch, syncs to the peer, and (when the
/// match ends) writes the result to Rally.
@MainActor
public final class MatchViewModel: ObservableObject {
    @Published public private(set) var state: MatchState
    private var history: [MatchState] = []

    private let connectivity = ConnectivityManager.shared
    private let api = RallyAPI.shared

    public init(config: MatchConfig = MatchConfig()) {
        self.state = ScoreEngine.newMatch(config)
        // ConnectivityManager calls this off the main queue's closure; hop to the
        // main actor so we can touch @Published state safely.
        connectivity.onReceive = { [weak self] incoming in
            Task { @MainActor in self?.adopt(incoming) }
        }
    }

    // MARK: Intents

    public func startNew(_ config: MatchConfig) {
        history.removeAll()
        state = ScoreEngine.newMatch(config)
        connectivity.send(state)
    }

    public func award(_ team: Team) {
        guard !state.finished else { return }
        let before = state
        history.append(before)
        state = ScoreEngine.awardPoint(before, to: team)
        reactToTransition(before: before, after: state)
        connectivity.send(state)
        if state.finished {
            let finished = state
            Task { await api.postResult(finished) }
        }
    }

    public var canUndo: Bool { !history.isEmpty }

    public func undo() {
        guard let previous = history.popLast() else { return }
        state = previous
        connectivity.send(state)
    }

    // MARK: Convenience for views

    public func pointLabel(_ team: Team) -> String { ScoreEngine.pointLabel(state, team) }
    public func name(_ team: Team) -> String { state.config.teamNames[team.rawValue] }
    public func isServing(_ team: Team) -> Bool { !state.finished && state.server == team }

    // MARK: Sync

    private func adopt(_ incoming: MatchState) {
        guard incoming.seq > state.seq || incoming.id != state.id else { return }
        state = incoming
        // Keep undo coherent after an external change.
        history.removeAll()
    }

    private func reactToTransition(before: MatchState, after: MatchState) {
        #if os(watchOS)
        if after.finished {
            WKInterfaceDevice.current().play(.success)
        } else if after.sets != before.sets {
            WKInterfaceDevice.current().play(.notification)
        } else if after.games != before.games {
            WKInterfaceDevice.current().play(.start)
        } else {
            WKInterfaceDevice.current().play(.click)
        }
        #endif
    }
}
