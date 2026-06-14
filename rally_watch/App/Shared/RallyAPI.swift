import Foundation
import PadelScoreKit

/// Posts a finished match to the same Base44 data center the web app uses
/// (see `rally_base44_code/BACKEND.md`, entity `MatchResult`). Best-effort and
/// fire-and-forget: if it isn't configured or the network fails, the match is
/// still complete on the watch.
///
/// To go live, fill in `appId` (and a token if your app requires auth) — the
/// same App ID you put in the web app's `.env` (`VITE_BASE44_APP_ID`).
public actor RallyAPI {
    public static let shared = RallyAPI()

    public var appId: String? = nil
    public var apiToken: String? = nil
    public var baseURL = URL(string: "https://app.base44.com/api")!

    public func configure(appId: String?, apiToken: String? = nil) {
        self.appId = appId
        self.apiToken = apiToken
    }

    public func postResult(_ state: MatchState) async {
        guard let appId, state.finished else { return }

        let payload: [String: Any] = [
            "source": "apple_watch",
            "won": state.winner == .a,
            "golden_point": state.config.goldenPoint,
            "sets": state.completedSets.map { ["us": $0.games[0], "them": $0.games[1]] },
            "team_names": state.config.teamNames,
        ]

        // Base44 entity create endpoint. Adjust the path/auth to match your app
        // if it differs — this is the documented REST shape.
        let url = baseURL.appendingPathComponent("apps/\(appId)/entities/MatchResult")
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if let apiToken { req.setValue("Bearer \(apiToken)", forHTTPHeaderField: "Authorization") }
        req.httpBody = try? JSONSerialization.data(withJSONObject: payload)

        _ = try? await URLSession.shared.data(for: req)
    }
}
