var library = require("module-library")(require)

module.exports = library.export(
  "play-media",[
  "web-element",
  "add-html"],
  function(element, addHtml) {
      
    var p = element.template.container("p")

    function player(script, id) {
      var source = element(
        element.tag("source"),{
        "src": "/voice/"+script,
        "type": "audio/mpeg"})

      var audioElement = element(
        element.tag("audio"),{
        "controls": "true"},
        source)

      if (id) {
        audioElement.id = id
      }

      return audioElement
    }

    function playerControls(script, id) {
      var audio = player(script, id)
      var controls = element(
        ".player-controls",
        audio)
      controls.playerId = audio.assignId()
      return controls }

    var starmanxPlea = [
      p("Starmanx would like to speak to you, will you enable her voice?"),
      p(element(
        "button.enable-voice",
        "Enable her voice")),
      element(
        "div.p",
        element(
          "button.who-is-she",
          "What kind of name is Starmanx?"),
        playerControls(
          "On my home planet it's an unusual but quite normal name",
          "starmanx")
      ),
      p(element(
        "button.silence",
        "Silence her!")),
    ]

    var allowed = null
    var asked = false
    var demandedCredentials = false
    var waiting = []
    function playMedia(id, delay, allowDelay) {

      if (typeof allowDelay == "undefined") {
        allowDelay = true
      }

      var video = document.getElementById(id)

      if (allowed === true) {
        setTimeout(
          playNow.bind(null, id),
          delay)
        return}

      if (allowed === false) {
        return }

      waiting.push([id, delay])


      if (!asked) {
        var page = element(
          ".lil-page",
          starmanxPlea)
        page.assignId()

        var newNodes = addHtml.inside(
          ".feed",
          page.html())

        var crucible = newNodes[0]

        var enable = crucible.querySelector("button.enable-voice")
        enable.onclick = enableVoice.bind(null, page.id)

        var who = crucible.querySelector("button.who-is-she")

        who.onclick = setTimeout.bind(
          null,
          whoIsStarmanx,
          500)

        var silence = newNodes[0].querySelector("button.silence")
        silence.onclick = removeElement.bind(null, page.id)

        asked = true}
    }

    function removeElement(id) {
      var node = document.getElementById(id)
      node.parentNode.removeChild(node)
    }

    function enableVoice(oldElementId) {
      allowed = true

      removeElement(oldElementId)

      if (demandedCredentials) {
        var message = "I appreciate the vote of confidence"
      } else {
        var message = "Thank you That feels good" }

      var starthanx = playerControls(
          message,
          "starmanx-thanks-you")

      addHtml.inside(
        ".feed",
        starthanx.html())

      playNow("starmanx-thanks-you")

      for(var i=0; i<waiting.length; i++) {
        var id = waiting[i][0]
        var delay = (waiting[i][1]||0) + 2000
        playMedia(id, delay, false)
      }
      waiting = []
    }

    function whoIsStarmanx() {
      playNow("starmanx")
      demandedCredentials = true
    }


    function playNow(id) {
      video = document.getElementById(id)

      if (!video) {
        console.log("Could not find video with id "+id)
        return

      } else if (video.tagName != "AUDIO") {
        throw new Error("Seems weird. We're supposed to play an audio element.")
      }

      video.onended = function() {
        video = document.getElementById(id)
        video.parentNode.classList.remove("playing")}

      video.onplay = function() {
        video = document.getElementById(id)
        video.parentNode.classList.add("playing")}

      var isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2
      if (isPlaying) {
        return }
      video.play().catch(
        andThrow) }

    function andThrow(e) {
      throw e }

    playMedia.player = playerControls

    return playMedia
  })
