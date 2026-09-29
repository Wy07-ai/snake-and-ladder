# Roadmap

Planned work is grouped by priority. Items are proposals and may change as the project evolves.

## Next

- **Sound effects:** Add optional dice-roll, movement, ladder, snake, and notification sounds with a mute control. Volume and mute settings already exist; the audio engine should read them via `getEffectiveVolume`.
- **Custom avatars:** Let players choose or personalize their pawn and chat avatar.
- **Theme selection:** Add a dark/light theme toggle and remember the selected preference.

## Later

- **Online multiplayer:** Support remote players using WebSockets, synchronized turns, and reconnect handling.
- **Room management:** Add private game rooms, invite links, and player-ready state for online matches.
- **Chat enhancements:** Add emoji reactions, message timestamps based on local settings, and accessibility preferences.

## Quality

- Add automated tests for game rules, turn handling, event triggers, and chat queue behavior.
- Review keyboard navigation, screen-reader announcements, and small-screen layouts as features expand.