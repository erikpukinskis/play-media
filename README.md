### Example

```javascript
var playMedia = require("play-media")

var player = playMedia.player(
  "/path/to/audio/file",
  "some-id")

document.write(player.html())

playMedia("some-id", 2000) // plays in 2 seconds
```
