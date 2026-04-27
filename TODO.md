# Baby Adelina Trivia — To-Do List

## Game Design (confirmed)
- 3 categories: Guess the Photo / Milestone Trivia / Raising Adelina
- Players choose one category per day
- 5 questions total per day across all categories
- Answering 3 questions correctly in Milestone Trivia OR Raising Adelina unlocks a video reward
- Videos are rewards for trivia performance (not weekly point thresholds)

---

## Next Up — Question Bank & Category UI

- [ ] Design question bank DB schema around user's JSON format
- [ ] Import starter questions from user-provided JSON
- [ ] Admin UI: view, add, edit, delete questions (Milestone Trivia + Raising Adelina)
- [ ] Player UI: category selection screen
- [ ] Player UI: question flow (5 questions/day limit, tracks across categories)
- [ ] Video unlock logic: 3 correct answers in Milestone Trivia or Raising Adelina → show reward video

---

## Guess the Photo (auto-generated questions)
- [ ] Daily photo picker — pick a random photo from media library, avoid recent repeats
- [ ] Age question (photo timestamp − birth date, weeks+days for early months)
- [ ] Time of day question (morning/afternoon/evening from timestamp)
- [ ] Location question (reverse geocode GPS if available, or manual tag on upload)
- [ ] Claude Vision API — generate 2–3 visual multiple choice questions per photo
- [ ] Admin UI to manually assign/override the photo of the day

---

## Gamification
- [ ] Points per question with difficulty multipliers
- [ ] Daily streak counter per player
- [ ] Leaderboard page — all players ranked by total points
- [ ] Badges for milestones

---

## Player Experience
- [ ] Player landing page — name entry on first visit (stored in localStorage)
- [ ] Category selection screen
- [ ] Question flow UI — one question at a time, track answers
- [ ] Results screen — score, correct answers, streak update
- [ ] Video reward screen

---

## Admin
- [ ] Set baby's birth date and name (config UI)
- [ ] Upload reward videos and assign to trivia categories
- [ ] Player stats dashboard

---

## Video Tag Vocabulary

Use these tags on both trivia questions and uploaded videos to power the tag-matched video rewards.

| Tag | What it covers |
|---|---|
| `smiling` | First smile, laughing, happy expressions |
| `rolling` | Rolling over milestones (tummy-to-back, back-to-tummy) |
| `tummy-time` | Head lifting, chest lifting, tummy play |
| `sleeping` | Crib transition, sleeping through the night |
| `sitting` | Sitting independently, seated play |
| `standing` | Pulling to stand, standing with support |
| `walking` | Cruising furniture, first steps |
| `talking` | Vocalizing, responding to voice, first words |
| `babbling` | Cooing, consonant babbling, back-and-forth sounds |
| `crying` | Crying types, hunger/pain/tiredness cues |
| `soothing` | Calming techniques, responding to distress |
| `attachment` | Bonding, responsive caregiving, cuddling research |
| `singing` | Singing to baby, music and calm |
| `playing` | Toy reaching, peek-a-boo, object play |
| `feeding` | Hunger cues, feeding milestones |
| `holding` | Being held, cuddling, carrying |
| `pincer-grip` | Picking up small objects with thumb and index finger |
| `development` | General developmental science (catch-all) |
| `milestone` | All milestone trivia questions carry this tag |

---

## Known Bugs
- [ ] **Grey line on walking + play-gym illustrations**: Sticker's warm-grey outline (~RGB 80-140) survives flood-fill background removal and appears as a grey line on the left edge. Many approaches tried (threshold tuning, strip_isolated_edge_lines, tight_crop). Try morphological erosion or a second-pass flood fill seeded from already-transparent pixels.
- [ ] **MC answer options not saving in /admin/questions**: Edits return 200 but changes don't persist. Root cause unknown.

---

## Deployment
- [ ] Set up Railway with persistent volume for /public/media
- [ ] Configure Railway environment variables
- [ ] Add production OAuth redirect URI to Google Cloud Console
- [ ] Set AUTH_URL to production domain
