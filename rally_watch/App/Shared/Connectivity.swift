import Foundation
import WatchConnectivity
import PadelScoreKit

/// Keeps the watch and the phone showing the same match. Every change ships the
/// whole `MatchState` (it is tiny); the receiver adopts it only if its `seq` is
/// newer. Live updates go over `sendMessageData` when the peer is reachable, and
/// fall back to `updateApplicationContext` (delivered on next wake) otherwise.
public final class ConnectivityManager: NSObject, ObservableObject, WCSessionDelegate {
    public static let shared = ConnectivityManager()

    /// Set by the view-model; called on the main queue with every inbound state.
    public var onReceive: ((MatchState) -> Void)?
    @Published public private(set) var isReachable = false

    private override init() {
        super.init()
        guard WCSession.isSupported() else { return }
        WCSession.default.delegate = self
        WCSession.default.activate()
    }

    public func send(_ state: MatchState) {
        guard WCSession.isSupported(),
              let data = try? JSONEncoder().encode(state) else { return }
        let session = WCSession.default
        guard session.activationState == .activated else { return }

        if session.isReachable {
            session.sendMessageData(data, replyHandler: nil) { _ in
                // Couldn't deliver live — leave the latest state for next wake.
                try? session.updateApplicationContext(["state": data])
            }
        } else {
            try? session.updateApplicationContext(["state": data])
        }
    }

    private func handle(_ data: Data) {
        guard let state = try? JSONDecoder().decode(MatchState.self, from: data) else { return }
        DispatchQueue.main.async { self.onReceive?(state) }
    }

    // MARK: WCSessionDelegate

    public func session(_ s: WCSession, didReceiveMessageData messageData: Data) {
        handle(messageData)
    }

    public func session(_ s: WCSession, didReceiveApplicationContext context: [String: Any]) {
        if let data = context["state"] as? Data { handle(data) }
    }

    public func session(_ s: WCSession,
                        activationDidCompleteWith activationState: WCSessionActivationState,
                        error: Error?) {
        DispatchQueue.main.async { self.isReachable = s.isReachable }
    }

    public func sessionReachabilityDidChange(_ s: WCSession) {
        DispatchQueue.main.async { self.isReachable = s.isReachable }
    }

    #if os(iOS)
    public func sessionDidBecomeInactive(_ session: WCSession) {}
    public func sessionDidDeactivate(_ session: WCSession) { WCSession.default.activate() }
    #endif
}
