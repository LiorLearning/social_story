export interface StoryPage {
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

export interface StoryBook {
  id: string;
  title: string;
  cover: string;
  pages: StoryPage[];
}

export const storyBooks: Record<string, StoryBook> = {
  "1": {
    id: "1",
    title: "Reese & the Geyser Eggs of Yellowstone",
    cover: "/covers/Reese-Adv.png",
    pages: [
      {
        type: "spread",
        left: { 
          image: "/covers/Reese-Adv1.png", 
          alt: "Reese and Oli running through misty Yellowstone at night with the Buffalo Dragon pursuing them" 
        },
        right: {
          text: "Night dropped over Yellowstone. Steam drifted like ghosts between pines. The Buffalo Dragon snorted, FWOOMP, and dust jumped. Reese grabbed Oli's hand. \"Do not look back.\" Hooves drummed nearer. Stars blinked like watchful eyes. They cut between hissing vents, breath burning, as the ground shivered like something huge rolled beneath it.",
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
          text: "The dragon lowered its horns and charged. Heat brushed their necks. Reese yanked Oli behind a boulder. Silence, then gravel scraped. The beast circled. \"Why us\" Oli whispered. A whistle rose from angry water. Reese peeked. The dragon's gaze was not hungry. It was herding them toward the geyser fields on purpose.",
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
          text: "Steam kissed their faces. Geysers coughed, pssshh, pssshh, like sleepy giants. A pale boulder gleamed ahead, egg smooth and moon shiny. Reese pressed his palm to it and a tingle raced his arm. The surface quivered, a knock from inside. Another knock answered from the ground. \"Not a rock,\" Reese breathed.",
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
          text: "\"Sockets,\" Oli murmured, pointing to tiny holes. Reese pulled blue, green, and red crystals from his pouch, their trip treasures. \"Pattern\" The egg hummed when blue touched, brighter with green, then sang with red. Across the mist, other mounds winked awake. Geysers inhaled together. The valley stilled, listening for the next click.",
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
          text: "Click. Click. Click. The egg glowed. BOOM. Lightning cracks raced and steam exploded. A dragon unfolded, wet wings, lantern eyes, breath like fog. It blinked at Reese, then toward the circling Buffalo Dragon. From the hills, faint knocks replied. More eggs answered. Oli swallowed. \"Did we start a chorus or an avalanche\"",
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
          text: "The newborn spun and fired a geyser comet, WHOOSH, sparkling water arcing like a liquid rainbow. Not fire, hot spray and thunder. The Buffalo Dragon pawed the ground, uncertain. One ancient dragon faced one shining new dragon. Reese felt the ground tapping again. Eggs counted and waited. \"We have seconds,\" he said.",
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
          text: "Near the cone lay a smooth, heavy bone. Reese lifted it with both hands and stepped forward, heart banging. \"Peace,\" he said, offering the gift. Crunch. The Buffalo Dragon chewed, ears tilting. Its gaze softened, barely. Steam ringed them like a drawn circle. \"One minute,\" Reese whispered. \"Make it count.\"",
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
          text: "The geyser dragon's eyes warmed. It knelt, ridged back steaming. Reese climbed on and Oli wrapped his waist. Wings unfurled, scattering moonlit mist. Below, eggs glittered like stars fallen into earth. Above, the Buffalo Dragon watched, not hunting, guarding. They rose through silver vapor as distant knocks quickened. The valley would wake soon.",
          audio: null
        }
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
          image: "/covers/Connor-banana.png", 
          alt: "Banana the Third with his red Santa hat in the jungle with gorillas, otters, and elephants" 
        },
        right: {
          text: "Banana the Third tipped his red Santa hat. \"Adventure o clock.\" Gorillas thumped like bongo drums. Otters waddled like jelly beans. Elephants rumbled like tummy growls before lunch. Vines dangled. Mist smelled like wet secrets. Banana winked. \"Jungle, bring it.\" The jungle said nothing. Which is how jungles say yes.",
          dropCap: true,
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Connor-banana.png",
          alt: "Ancient temple interior with torches and dancing shadows on carved walls" 
        },
        right: {
          text: "Inside the temple, torches went fssst pop. Shadows did the wiggle dance on lions, turtles, and a goat who clearly took tap lessons. \"Very old,\" Banana whispered. The floor purred. Somewhere, claws clicked. \"Surprises ahead,\" Banana said. He grinned so big his hat almost fell off. Almost.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Connor-banana.png",
          alt: "Xuro the jaguar leaping from a cracked arch with shiny teeth" 
        },
        right: {
          text: "Xuro the jaguar leaped from a cracked arch, teeth shiny like tiny moons. \"The treasure is mine,\" he roared. Banana raised his lantern. \"Sharing is caring. Also, I have snacks.\" Xuro blinked. \"Snacks\" \"Team snacks,\" Banana added. Xuro's tail swished. Translation: he was thinking about treasure and snacks at the same time.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Connor-banana.png",
          alt: "Gorillas drumming, elephants stomping, otters squeaking in the temple" 
        },
        right: {
          text: "Gorillas drummed boom boom boom. Elephants stomped thud thud thud. Otters squeaked like rubber ducks at a birthday party. The echo zipped down the hall and came back wearing a new beat. Xuro half smiled. \"The temple likes our music,\" Banana said. \"Or our snacks,\" an otter squeaked hopefully.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Connor-banana.png",
          alt: "Temple walls coming alive with glowing maze patterns" 
        },
        right: {
          text: "Walls whooooshed alive. Glowing lines slid together, a maze drawing itself like lightning practicing cursive. \"Puzzle party,\" Banana said. \"Temple, show us your best dance.\" Patterns pulsed. A doorway breathed open, then closed. \"After you,\" Banana bowed. The doorway stayed open. Good manners are powerful. Remember that, doors.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Connor-banana.png",
          alt: "Team of animals working together solving temple puzzles" 
        },
        right: {
          text: "Team time. Gorillas nudged mega blocks. Otters slip slid through tiny tunnels and booped secret levers. Elephants lifted stones like marshmallows. Proud faces everywhere. Banana called plays. \"Left. Lift. Otter express.\" Click. Clack. Ker chunk. The floor rolled away, like a tongue saying wow. \"Deeper please,\" whispered the temple.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Connor-banana.png",
          alt: "Giant door opening while elephants block Xuro with their rumps" 
        },
        right: {
          text: "A giant door groaned, creeeak. Maybe it needed a snack too. Xuro pounced. Elephants lined up rump to rump, a perfect wall. \"Denied,\" Banana said, very politely. Xuro melted into shadow. \"Round two later,\" Banana whispered. Dust sparkled. Toes tiptoed. Even bravest heroes tiptoe sometimes. It is allowed.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Connor-banana.png",
          alt: "Golden owl statue with spread wings and a mysterious black crystal in an open chest" 
        },
        right: {
          text: "The wow room. A golden owl spread shiny wings. Eyes blinked like twin flashlights. \"Only true hearts may see the treasure,\" it boomed. The chest snapped open. No coins. No crowns. A black crystal pulsed. Thump. Thump. Torches fizzled. A friendly voice curled through the dark. \"Finally. Guests.\"",
          audio: null
        }
      }
    ]
  },
  "3": {
    id: "3",
    title: "The Mischievous Teacher",
    cover: "/covers/Gaia-School.png",
    pages: [
      {
        type: "spread",
        left: { 
          image: "/covers/Gaia-School.png", 
          alt: "Jill and Maddy entering a dark, eerie school hallway with bloody handprints on lockers" 
        },
        right: {
          text: "Jill and Maddy stepped into Fairview and stopped. Bloody handprints stained the lockers, and the hallway smelled like iron. Above them, the old clock ticked backward, each jerk louder than the last. Lights hummed; whispers stretched thin. Jill gripped Maddy's sleeve. \"This isn't our normal school,\" she said. \"It wants us to notice.\"",
          dropCap: true,
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Gaia-School.png", 
          alt: "Miss Thornton with an unnaturally wide smile and unblinking eyes" 
        },
        right: {
          text: "\"Good morning,\" Miss Thornton sang, cardigan neat, bun tight. Her smile looked warm, but her eyes didn't blink. The lights flickered; a cold draft slid by. \"Don't be late,\" she said, watching too closely. Jill forced a smile back. The building felt like it was listening. Jill thought: She knows we know.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Gaia-School.png", 
          alt: "Jill finding threatening notes in her desk and math book" 
        },
        right: {
          text: "Jill opened her desk. A note flipped out: \"LOSER 102.\" Another hid in her math book: \"LOOK AWAY.\" Not warnings—dares pressed so hard the paper tore. Maddy mouthed, What is it? Jill showed both slips, hands shaking. The backward clock kept ticking—steady, wrong, relentless—as if counting down to them.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Gaia-School.png", 
          alt: "Miss Thornton's phone screen showing a sinister message" 
        },
        right: {
          text: "Pencils scratched. Miss Thornton's phone buzzed three times. Its glow carved sharp shadows across her face. Maddy glanced—then froze. On the screen: \"Did you get the kid?\" A job, not a joke. The screen locked; the teacher scanned the room, pausing on them. Air thinned. A plan was running, and they were inside it.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Gaia-School.png", 
          alt: "A trapdoor in the classroom floor revealing glowing green substance below" 
        },
        right: {
          text: "The floor creaked like something below was breathing. Jill's sneaker tapped; a board lifted. She pried it open. A sour, metallic smell rose as green goo pulsed slowly, heartbeat-bright. Carved symbols ringed the hole, faintly glowing. \"Close it,\" Maddy whispered. Jill couldn't. Her flashlight shook. This wasn't storage. It was a path.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Gaia-School.png", 
          alt: "Miss Thornton's cane transforming into a living snake with golden eyes" 
        },
        right: {
          text: "The door slammed. Miss Thornton stood in the flicker-light, cane tapping. Wood rippled; the handle peeled into scales. A snake uncoiled—fangs white, eyes gold. Hiss—long and glassy. Desks scraped; someone screamed. \"Meet Snappy,\" she said, stroking its head. Not a pet—a partner. Below, the trapdoor glowed. Miss Thornton had moved first.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Gaia-School.png", 
          alt: "Jane bravely confronting the snake as it coils around her arm" 
        },
        right: {
          text: "Everyone shrank back. Jane stepped forward. Snappy lunged; she lifted her arm. The snake coiled tight—cold, fast, shining—then stilled. It looked into her eyes and quieted. Miss Thornton's smile cracked; control slipped. \"Good,\" Jane whispered, stroking living metal. Snappy settled like a bracelet. For the first time today, hope breathed.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Gaia-School.png", 
          alt: "The children running through a corridor of mirrors showing distorted reflections" 
        },
        right: {
          text: "They ran, a door splintered, and a corridor of mirrors glowed. Light swam in the glass like trapped water. Jill's father appeared, arms open—then melted into Miss Thornton's grin. Whispers slid: Stay… forever. Reflections multiplied—offset, wrong. The floor felt icy though dry. Snappy tightened around Jane's arm, hissing—the only honest sound.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Gaia-School.png", 
          alt: "Two versions of Miss Thornton emerging from mirrors - one kind, one evil" 
        },
        right: {
          text: "The glass rippled; two Miss Thorntons stepped out. One kind, hands open. One smiling with too many teeth, eyes red. \"Children,\" said one. \"Come,\" said the other. Together: \"Choose.\" Jill trembled. Pick wrong, stay forever. Snappy watched the cruel one, unblinking. Shadows bent the wrong way. \"Trust him,\" Jill whispered.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Gaia-School.png", 
          alt: "The children escaping through a final door as the school crumbles behind them" 
        },
        right: {
          text: "Lightning-quick, Snappy struck. Glass burst into stars; the cruel one reeled. The maze cracked, seams glowing white. \"Go!\" Jane shouted. They sprinted through bending halls to a final door—night air, cold and real. A bus idled; doors sealed behind them. Safe… maybe. In the window's reflection, Miss Thornton smiled. Far behind, a green heartbeat counted backward.",
          audio: null
        }
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
          image: "/covers/Mila-and-Vivienne.png", 
          alt: "Two sisters with backpacks standing at the edge of a magical forest" 
        },
        right: {
          text: "Mila and Vivienne were sisters who shared everything - their room, their secrets, and most importantly, their love for adventure. Every summer, they would pack their matching backpacks and set off to explore the mysterious Whispering Woods behind their grandmother's house.",
          dropCap: true,
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Mila-and-Vivienne.png", 
          alt: "The sisters discovering a hidden path marked by glowing stones" 
        },
        right: {
          text: "This year was different. As they ventured deeper into the woods than ever before, they discovered a path marked by stones that glowed with soft, blue light. 'Look, Vivi!' whispered Mila. 'These stones are warm, even though it's cool in the shade.'",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Mila-and-Vivienne.png", 
          alt: "A hidden valley with a crystal-clear lake and floating islands" 
        },
        right: {
          text: "The glowing path led them to a hidden valley where a crystal-clear lake reflected the sky like a mirror. But the most amazing sight was the tiny islands floating in the air above the water, each one covered with flowers that chimed like bells in the breeze.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Mila-and-Vivienne.png", 
          alt: "The sisters carefully stepping onto a floating island" 
        },
        right: {
          text: "Vivienne, who was always the braver of the two, stepped onto the lowest floating island. To their amazement, it held her weight perfectly! Soon both sisters were island-hopping through the air, their laughter echoing across the magical valley.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Mila-and-Vivienne.png", 
          alt: "The sisters writing in their adventure diary under a starry sky" 
        },
        right: {
          text: "That night, they camped under the stars and wrote in their adventure diary: 'Today we discovered that the most magical places are found when you're brave enough to follow the unknown path, and the best adventures are the ones you share with someone you love.'",
          audio: null
        }
      }
    ]
  }
};


