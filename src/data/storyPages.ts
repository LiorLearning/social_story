export interface SpreadPage {
  type: 'spread';
  left: {
    image: string;
    alt: string;
  };
  right: {
    text: string;
    dropCap?: boolean;
    audio?: string | null;
  };
}

export interface FinalPage {
  type: 'final';
  image: string;
  alt: string;
  title: string;
  subtitle?: string;
  text: string;
  audio?: string | null;
}

export type StoryPage = SpreadPage | FinalPage;

export interface StoryBook {
  id: string;
  title: string;
  cover: string;
  pages: StoryPage[];
}

export const storyBooks: Record<string, StoryBook> = {
  "1": {
    id: "1",
    title: "Geyser Eggs of Yellowstone - Part 2",
    cover: "/covers/Reese-Adv.png",
    pages: [
      {
        type: "spread",
        left: { 
          image: "/covers/Reese-Adv1.png", 
          alt: "Reese and Oli running through misty Yellowstone at night with the Buffalo Dragon pursuing them" 
        },
        right: {
          text: "Night dropped over Yellowstone. Steam drifted between the pines as a Buffalo Dragon rose, hide hot as a stove and breath like a hot spring. Oli froze, but Reese stayed steady and took his hand. \"Do not look back,\" Reese said, leading him toward the geyser field.",
          dropCap: true,
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Reese-Adv2.png", 
          alt: "The Buffalo Dragon charging with lowered horns while Reese and Oli hide behind a boulder" 
        },
        right: {
          text: "The dragon lowered its horns and charged, heat brushing their necks. Reese pulled Oli behind a boulder and listened. A thin whistle rose from the vents. The beast was not hunting them; it was pushing them toward the geysers on purpose.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Reese-Adv3.png", 
          alt: "A pale, egg-shaped boulder glowing in the mist among steaming geysers" 
        },
        right: {
          text: "Steam kissed their faces as a pale boulder gleamed ahead, smooth as an egg. Reese pressed his palm to it and a tingle ran up his arm. The shell quivered. A knock sounded inside, and another knock answered from the ground.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Reese-Adv4.png", 
          alt: "Reese inserting colorful crystals into sockets on the glowing egg" 
        },
        right: {
          text: "\"Sockets,\" Oli said, pointing to tiny round holes. Reese took blue, green, and red crystals from his pouch and set them in place. Blue made the egg hum, green made it glow, and red made it sing. Across the mist, other mounds seemed to wake while the valley held its breath.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Reese-Adv5.png", 
          alt: "A dragon hatching from the egg in an explosion of steam and light" 
        },
        right: {
          text: "A last click answered and the egg cracked wide. Steam burst as a dragon unfolded with wet wings and bright eyes. It looked at Reese, then at the circling Buffalo Dragon. From the hills came faint knocks, and more eggs replied.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Reese-Adv6.png", 
          alt: "The newborn dragon firing a geyser comet while facing the Buffalo Dragon" 
        },
        right: {
          text: "The newborn spun and sent a geyser comet into the sky. Water arced like a rainbow as the Buffalo Dragon pawed the ground, unsure. Old met new across the steaming field. Reese felt the tapping again and knew the eggs were counting; \"We have seconds,\" he said.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Reese-Adv7.png", 
          alt: "Reese offering a smooth bone to the Buffalo Dragon as a peace gesture" 
        },
        right: {
          text: "Near the cone lay a smooth, heavy bone. Reese lifted it with both hands and stepped forward. \"Peace,\" he said, offering the gift as the Buffalo Dragon chewed and its ears tilted. Steam drew a ring around them and trust grew for one hard minute.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Reese-Adv8.png", 
          alt: "Reese and Oli riding the geyser dragon through silver mist while the Buffalo Dragon watches from below" 
        },
        right: {
          text: "The geyser dragon's eyes warmed and it knelt. Reese climbed on and Oli held tight as wings lifted them through silver mist. Below, the Buffalo Dragon kept watch while the eggs glowed like little hearths. Somewhere deep, a slow knock answered, gentle and patient, as if something was still waiting for Reese to return.",
          audio: null
        }
      },
      {
        type: "final",
        image: "/covers/Reese-Adv8.png",
        alt: "Reese and Oli riding the geyser dragon through silver mist",
        title: "Karaoke Ending",
        subtitle: "Reese & Oli",
        text: "Intro. Valley calls us now, can you feel the sound? (whoa oh) Verse 1. Night drapes Yellowstone, steam wakes the pines Buffalo Dragons hum, courage in our minds Oli hesitates but Reese ignites the flame \"Hand in hand we stand—forever unafraid\" Build. Ground starts to tremble, geysers roar Our hearts beat louder than ever before Chorus. Run to the light, to the edge of the lake Valley's heart awakens—feel how it shakes Hand in hand, we rise, fearless and brave We ride the song those geysers made (ride the song the geysers made) Verse 2. Colors blaze in steam—blue, green, then red Cracks of life appear where the cold once spread Shells break open wide, new wings touch the sky Lantern eyes ignite—a brand-new light Build 2. Rhythms of the earth, a rising drum Count with me now—our time has come Bridge. Lead: One! Crowd: One! Lead: Two! Crowd: Two! Lead: Three! Crowd: Three! Raise your voice—let the anthem ring! Final Chorus. Run to the light, to the edge of the lake Valley's heart awakens—feel how it shakes Hand in hand, we rise, fearless and brave We ride the song those geysers made Up we climb, the anthem we've craved United strong, in light we're saved Outro. Peace in our victory, echoes through the night Valley's heartbeat fades until next ride",
        audio: "/covers/audio/Reese-geyser.mp3"
      }
    ]
  },
  "2": {
    id: "2",
    title: "The Banana Monkey & Jaguar Battles",
    cover: "/covers/Connor-banana.png",
    pages: [
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252FConnor%252F20250917_235608.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN", 
          alt: "Banana the Third with his red Santa hat in the jungle with gorillas, otters, and elephants" 
        },
        right: {
          text: "Banana the III is ready. He tips his Santa hat and grins. \"Adventure o'clock,\" he says. His crew surrounds him—gorillas thump, otters waddle, elephants rumble. Vines hang low and the mist smells like wet secrets. Banana winks. \"Jungle, bring it on.\" But is the team ready for the surprises ahead?",
          dropCap: true,
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252FConnor%252F20250917_235841.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN",
          alt: "Ancient temple interior with torches and dancing shadows on carved walls" 
        },
        right: {
          text: "They step inside the temple. Torches go fssst-pop and shadows wiggle on lions, turtles, and a tap-dancing goat. \"Very old,\" Banana whispers as the floor gives a soft purr. Far down the hall, claws click. Two green eyes blink, slow and sure.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252FConnor%252Fgenerated_image_20241202_235552.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN",
          alt: "Xuro the jaguar leaping from a cracked arch with shiny teeth" 
        },
        right: {
          text: "The eyes belong to Xuro the jaguar. He leaps from a cracked arch, teeth like tiny moons. \"The treasure is mine,\" he roars. Banana lifts his lantern. \"Sharing is caring. Also… snacks.\" Xuro's tail swishes once. He is listening.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252FConnor%252F20250918_000525.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN",
          alt: "Gorillas drumming, elephants stomping, otters squeaking in the temple" 
        },
        right: {
          text: "Drums answer first. Gorillas boom-boom and elephants stomp thud-thud while otters squeak like birthday ducks. Echoes race the walls and swirl back with a new beat. \"The temple likes our music,\" Banana says, smiling. Xuro's whiskers twitch as he listens for the next move.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252FConnor%252F20250918_001225.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN",
          alt: "Temple walls coming alive with glowing maze patterns" 
        },
        right: {
          text: "The walls wake with a whooosh. Glowing lines slide into a quick, bright maze. \"Puzzle party,\" Banana says. \"Show us the way.\" Patterns pulse and a doorway breathes open, then shut. Banana bows and says, \"After you.\" The door stays open. Good manners work.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252FConnor%252F20250918_002826.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN",
          alt: "Team of animals working together solving temple puzzles" 
        },
        right: {
          text: "Beyond the door, the floor turns into a job. Gorillas nudge mega blocks into place. Otters zip through tiny tunnels and boop hidden levers. Elephants lift stones like soft marshmallows, steady and proud. \"Left. Lift. Otter express,\" Banana calls. Click. Clack. Ker-chunk. The floor rolls back and whispers, \"Deeper, please.\"",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252FConnor%252F20250918_003552.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN",
          alt: "Giant door opening while elephants block Xuro with their rumps" 
        },
        right: {
          text: "Deeper waits a giant door that groans and creaks. Xuro springs, but the elephants line up rump to rump and make a perfect wall. \"Denied,\" Banana says, very polite. Xuro melts into shadow. \"Round two later,\" Banana whispers as dust sparkles and toes tiptoe. Even heroes tiptoe. It's allowed.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252FConnor%252F20250918_012600.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN",
          alt: "Golden owl statue with spread wings and a mysterious black crystal in an open chest" 
        },
        right: {
          text: "They tiptoe into the wow room. A golden owl spreads bright wings and its eyes blink like twin flashlights. \"Only true hearts may see the treasure,\" it booms. The chest snaps open—no coins, no crowns. A black crystal pulses. Thump. Thump. Torches fizzle. A kind voice curls through the dark and says, \"Finally… guests.\"",
          audio: null
        }
      },
      {
        type: "final",
        image: "/covers/Connor-banana.png",
        alt: "Banana the Third with his red Santa hat in the jungle",
        title: "Karaoke Ending",
        subtitle: "The Banana Monkey",
        text: "Verse 1. Swing, swing, swing through the jungle trees. Banana Monkey's laughing in the breeze. Drums go boom, and the vines go snap. Clap your hands with a jungle clap! Chorus. Hey, hey, jungle play. Sing and dance the monkey way! Treasure shines and friends are near. Adventure time is finally here! Verse 2. Here comes Jaguar, sneaky and sly. Watching with his clever eye. But when the team all sings along. Even jaguars can join the song! Chorus. Hey, hey, jungle play. Sing and dance the monkey way! Treasure shines and friends are near. Adventure time is finally here! Bridge. Otters squeak, elephants stomp. Gorillas drum with a jungle thomp! Glow of torches, puzzles bright. The jungle sings with all its might! Final Chorus. Hey, hey, jungle play. Sing and dance the monkey way! Banana Monkey leads the cheer. Adventure time is always here!",
        audio: "/covers/audio/banana-monkey.mp3"
      }
    ]
  },
  "3": {
    id: "3",
    title: "Jilly, and Maddy's school days",
    cover: "/covers/Gaia-School.png",
    pages: [
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252Ftestuser%252F20250923_232144.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN", 
          alt: "Jill and Maddy approaching Fairview school, a neat brick building with a tall old clock tower" 
        },
        right: {
          text: "Jill and Maddy start at Fairview, a neat brick school with a tall old clock. Inside, the clock ticks backward. Rusty-red handprints smear two lockers. Jill whispers, \"Something here wants to be seen.\"",
          dropCap: true,
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252Ftestuser%252F20250923_232347.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN", 
          alt: "Miss Thornton greeting the class with a warm smile but cold, unblinking eyes" 
        },
        right: {
          text: "Miss Thornton—soft cardigan, bright smile—greets the class. Her smile is warm; her eyes aren't. When the bell rings, the lights hum like bees. Jill feels the building listening.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252Ftestuser%252F20250923_232610.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN", 
          alt: "Jill discovering mysterious folded notes in her desk and math book" 
        },
        right: {
          text: "A folded slip drops from Jill's desk: **LOSER 102**. Another hides in her math book: **LOOK AWAY**. Maddy squeezes her hand. Jill says, \"Nope. We look closer.\"",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252Ftestuser%252F20250923_232813.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN", 
          alt: "Miss Thornton's phone screen briefly showing a sinister message" 
        },
        right: {
          text: "Miss Thornton's phone buzzes—three sharp taps. For a breath, the screen shows: **Did you get the kid?** The phone locks; the smile returns. Jill and Maddy know it wasn't a joke.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252Ftestuser%252F20250923_233353.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN", 
          alt: "Empty classroom after lunch with the backward clock ticking louder" 
        },
        right: {
          text: "After lunch, two younger kids don't come back from recess. Teachers say, \"Early pickup.\" The backward clock jerks louder. Jill and Maddy decide to follow Miss Thornton after school.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252Ftestuser%252F20250923_234547.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN", 
          alt: "A trapdoor in Room 12 with glowing green light and mysterious symbols" 
        },
        right: {
          text: "In Room 12, the floorboards breathe. Jill's sneaker finds a loose plank; green glow leaks through. Symbols circle a trapdoor like tiny stars. They lift it and climb down.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252Ftestuser%252F20250923_234636.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN", 
          alt: "Underground tunnel with pipes, gadgets, and a mysterious cane that transforms into a silver snake" 
        },
        right: {
          text: "A tunnel of pipes, a table of gadgets, a cage with stickers from field trips. A cane leans on the wall; its wood ripples and becomes a silver snake. It hisses, then curls around Jill's wrist like a cold bracelet. \"Snappy,\" Maddy names it. Snappy nods.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252Ftestuser%252F20250923_234802.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN", 
          alt: "Miss Thornton in the shadows speaking on her phone while doors seal shut" 
        },
        right: {
          text: "Miss Thornton steps from the shadows, phone to her ear. \"We deliver before midnight,\" she says. \"The Boss hates delays.\" She snaps her fingers; doors seal. Desks above grind into place like a lid.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252Ftestuser%252F20250924_001147.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN", 
          alt: "A hall of mirrors with multiple reflections and two different versions of Miss Thornton" 
        },
        right: {
          text: "Snappy leads them into a side passage—glass walls, whispering voices. Reflections make ten Jills, ten Maddys, and two Miss Thorntons. One Miss Thornton is kind with open hands. The other smiles too wide.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252Ftestuser%252F20250924_001420.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN", 
          alt: "The two Miss Thorntons confronting the children, forcing them to choose" 
        },
        right: {
          text: "\"Children,\" both say. \"Choose.\" Jill remembers the texts, the missing kids, the sealed doors. She trusts the one Snappy stares at without blinking—**not** the wide smile. \"Now,\" Jill says. They run past the real one while Snappy strikes.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252Ftestuser%252F20250924_001649.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN", 
          alt: "Glass shattering like stars as the children escape through a final door to a waiting bus" 
        },
        right: {
          text: "Glass bursts like stars. They shove a final door; night air rushes in, cold and honest. A bus idles at the curb—driver waiting, frightened, but brave. They pile in, shouting for help as the doors hiss shut.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252Ftestuser%252F20250924_002651.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN", 
          alt: "Police cars surrounding the school in the morning while Miss Thornton is taken away still smiling" 
        },
        right: {
          text: "Police swarm the school by morning. Miss Thornton is taken away, smiling the whole time. Jill and Maddy hug their parents—and keep Snappy hidden under Jill's sleeve. That night the old clock in Jill's hallway ticks… backward. On her window, a fresh note glows green: **SEE YOU SOON.**",
          audio: null
        }
      },
      {
        type: "final",
        image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252Ftestuser%252F20250924_002651.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN",
        alt: "Jill and Maddy safe at home with Snappy hidden, but a glowing green note on the window",
        title: "Karaoke Ending",
        subtitle: "Jilly, and Maddy's school days",
        text: "Verse 1. Tick… tick… backward… clock. There's dust in the light and a hallway that listens, Notes in the margins—\"Loser one-oh-two.\" \"Look away,\" they said—so we didn't. Verse 2. We looked closer. We found the truth. A smile at the door that never reached the eyes, A phone that whispered, \"Did you get the kid?\" Under floorboards—green glow, secret signs. Chorus. Backward clock, we're counting brave not time, Hand in hand, through mirrors and the lies. When the doors slam shut, we still find the line: If fear says \"go,\" our hearts say \"Not tonight.\" Bracelet snake with amber eyes, Chooses light when shadows rise, Bus lights warm the freezing night— Hold on tight. We'll make it right. Chorus Reprise & Outro. Backward clock, we're counting brave not time, Glass like stars—We won't look away this time. See you soon.",
        audio: "/covers/audio/Jill-maddy.mp3"
      }
    ]
  },
  "4": {
    id: "4",
    title: "John Doe, the Ice Monster",
    cover: "/covers/Icyterrain.png",
    pages: [
      {
        type: "spread",
        left: { 
          image: "/covers/Icyterrain.png", 
          alt: "A frozen landscape with mysterious ice formations" 
        },
        right: {
          text: "In the frozen wasteland of the Arctic, where the wind howled like a thousand wolves and the ice stretched endlessly in every direction, there lived a creature that the local Inuit people called Tuurngait - the Ice Monster.",
          dropCap: true,
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Icyterrain.png", 
          alt: "A large, gentle ice creature with kind eyes" 
        },
        right: {
          text: "But John Doe wasn't really a monster at all. He was made entirely of ice and snow, with icicles for hair and eyes like frozen lakes. He was lonely, for everyone who saw him ran away in fear, thinking he would freeze them solid with his touch.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Icyterrain.png", 
          alt: "John Doe sadly watching people run away from him" 
        },
        right: {
          text: "John spent his days creating beautiful ice sculptures - flowers that never wilted, animals that seemed to breathe, and castles that sparkled like diamonds. But no one stayed long enough to see his art, and his heart grew colder with each passing day.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Icyterrain.png", 
          alt: "A brave child approaching John Doe without fear" 
        },
        right: {
          text: "One day, a young Inuit girl named Siku got lost in a blizzard. She stumbled upon John's ice garden and, instead of running away, she gasped in wonder. 'These are the most beautiful sculptures I've ever seen!' she exclaimed, her breath forming little clouds in the cold air.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Icyterrain.png", 
          alt: "John Doe and Siku becoming friends, sharing stories" 
        },
        right: {
          text: "From that day on, Siku visited John every week. She taught him about friendship and warmth that comes from the heart, not from fire. And John learned that being different didn't make him a monster - it made him special, a guardian of the beautiful frozen world.",
          audio: null
        }
      },
      {
        type: "final",
        image: "/covers/Icyterrain.png",
        alt: "John Doe and Siku becoming friends in the frozen landscape",
        title: "Karaoke Ending",
        subtitle: "John Doe, the Ice Monster",
        text: "Siku visited John every week. She taught him about friendship and warmth. John learned that being different made him special.",
        audio: null
      }
    ]
  },
  "5": {
    id: "5",
    title: "Mila and Vivienne's Adventure Diary",
    cover: "/covers/Mila-and-Vivienne.png",
    pages: [
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252Ftestuser%252F20250919_222814.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN", 
          alt: "Two sisters with backpacks standing at the edge of a magical forest" 
        },
        right: {
          text: "The sun felt like a warm hug, and the meadow was a giant green pillow. Mila dribbled fast—tap-tap-tap! Vivienne raced behind her, laughing loud. \"Too slow!\" Mila shouted. Their feet thudded like drums, kicking up daisies and giggles as the ball sped into the tall grass. It was just another perfect soccer afternoon—until it wasn't.",
          dropCap: true,
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252Ftestuser%252F20250919_225219.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN", 
          alt: "The sisters discovering a hidden path marked by glowing stones" 
        },
        right: {
          text: "\"Goal!\" they cheered, kicking between two dandelions. The pretend \"mud monster\" and \"tree goalie\" didn't stand a chance! From the branches, birds flapped skyward. Fireflies blinked early, sprinkling golden sparks. High-fives flew as laughter echoed across the meadow. Mila beamed. \"Best match ever!\" But just as the fireflies danced brighter… the air began to shift.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252Ftestuser%252F20250919_233800.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN", 
          alt: "A hidden valley with a crystal-clear lake and floating islands" 
        },
        right: {
          text: "Mila kicked one last shot—fwip! The ball zipped into the grass and vanished. Vivienne chased, then froze. \"Mila…\" she whispered. Silver mist curled like a sleeping dragon's breath. It shimmered—glow-y, whisper-y, full of secrets. The ball was gone. They stepped closer, hearts pounding. Mist moved like it had a mind. Something waited.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "https://tutor.mathkraft.org/_next/image?url=%2Fapi%2Fproxy%3Furl%3Dhttps%253A%252F%252Fd1ptidrpttdm41.cloudfront.net%252Ftestuser%252F20250922_211945.png&w=3840&q=75&dpl=dpl_2uGXzhZZsLneniBZtsxr7PEabQXN", 
          alt: "The sisters writing in their adventure diary under a starry sky" 
        },
        right: {
          text: "Shoulder to shoulder, Mila squeezed Vivienne's hand. The mist shivered into an oval shape—a doorway made of starlight. Inside, something flickered fast like a shadow. \"Do we go in?\" Mila asked. The silver light stretched toward their toes. Sparks floated in the air. Vivienne nodded. Together, they stepped forward—ready for whatever came next.",
          audio: null
        }
      },
      {
        type: "final",
        image: "/covers/Mila-and-Vivienne.png",
        alt: "The sisters writing in their adventure diary under a starry sky",
        title: "Karaoke Ending",
        subtitle: "Mila and Vivienne's Adventure Diary",
        text: "They camped under the stars and wrote in their diary. The most magical places are found when you're brave. The best adventures are shared with someone you love.",
        audio: null
      }
    ]
  }
};


