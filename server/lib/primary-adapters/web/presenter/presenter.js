export default class Presenter {
  toUserDto = user => ({
    username: user.username,
    profileSketch: user.profileSketch,
    biography: user.biography,
    karma: user.karma,
    accentColor: user.accentColor,
    sketches: user.sketches
  })

  toSketchDto = sketch => ({
    id: sketch.id,
    title: sketch.title,
    author: sketch.author,
    size: sketch.size,
    boxes: sketch.boxes,
    votes: sketch.votes,
    comments: sketch.comments,
    dominantColors: sketch.dominantColors
  })
}
