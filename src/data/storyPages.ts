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
          alt: "Reese and Finn standing on a misty path in Yellowstone" 
        },
        right: {
          text: "Night drops like a soft blanket. Stars blink on. The Buffalo Dragon snorts—FWOOMP! A cool wind lifts dust as Reese and Oli grab hands and run.",
          dropCap: true,
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Reese-Adv2.png", 
          alt: "The geyser field at dusk with steam rising" 
        },
        right: {
          text: "The dragon lowers its horns and charges. Hooves drum the ground—badum, badum! Hot breath washes their backs. Grass bends as it rushes by",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Reese-Adv3.png", 
          alt: "Mysterious glowing eggs among the geysers" 
        },
        right: {
          text: "Steam hisses—pssshh! Warm mist beads on their cheeks. Geysers pop and puff. A thin path twists toward a giant rock shaped like an egg with a shiny skin.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Reese-Adv4.png", 
          alt: "A baby dragon emerging from the glowing egg" 
        },
        right: {
          text: "Oli points to tiny round holes—sockets. Reese squints. “Not a rock. A Geyser Egg.” He pulls out blue, green, and red crystals. The crystals sparkle, and other hidden eggs wink in the dark.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Reese-Adv5.png", 
          alt: "Reese and Finn following the baby dragons" 
        },
        right: {
          text: "Click. Click. Click. Crystals slide into sockets and glow. BOOM! Cracks race like lightning. The shell opens. A huge dragon unfolds—wet, steamy, wings dripping, eyes bright as lanterns.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Reese-Adv6.png", 
          alt: "Reese and Finn follow" 
        },
        right: {
          text: "The dragon spins and blasts a roaring ball of geyser water—WHOOSH! Not fire—hot, sparkling spray. The mist arches high and hangs like a moonlit rainbow",
          audio: null
        }
      }
      ,
      {
        type: "spread",
        left: { 
          image: "/covers/Reese-Adv7.png", 
          alt: "Reese and follow" 
        },
        right: {
          text: "Reese spots a smooth, heavy bone. He offers it with both hands. Crunch! ",
          audio: null
        }
      }
      ,
      {
        type: "spread",
        left: { 
          image: "/covers/Reese-Adv8.png", 
          alt: "Reese and follow" 
        },
        right: {
          text: "The dragon’s eyes soften. It kneels low. Reese climbs onto its broad, warm, ridged back as silver mist curls around them",
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
          alt: "Banana the III with his red Santa hat in the jungle" 
        },
        right: {
          text: "Banana the III tilted his red Santa hat and winked. \"Adventure o'clock!\" he chirped. Gorillas thumped, otters waddled, elephants rumbled. Vines dangled like spaghetti, and the mist smelled like wet leaves and secrets.",
          dropCap: true,
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Connor-banana.png",
          alt: "Ancient temple interior with dancing shadows and torches" 
        },
        right: {
          text: "Inside, torches went fssst-pop! Shadows danced on walls carved with lions, turtles, even a tap-dancing goat (probably). \"This temple is OLD-old,\" whispered Banana. Then—grrrrr—something growled back.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Connor-banana.png",
          alt: "Xuro the jaguar leaping out with fierce teeth bared" 
        },
        right: {
          text: "Xuro the jaguar sprang out, teeth like tiny moons. \"The treasure is mine!\" he roared. Banana held his lantern high. \"Sharing is caring,\" he said. \"Also, we're a team.\"",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Connor-banana.png",
          alt: "Gorillas drumming, elephants stomping, otters squeaking" 
        },
        right: {
          text: "Gorillas drummed a boom-boom beat. Elephants stomped a quake—thud-THUD! Otters squeaked a brave squeak (it sounded like a rubber duck). Xuro's tail swished like a jump rope before recess.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Connor-banana.png",
          alt: "Temple walls lighting up with glowing symbols and maze patterns" 
        },
        right: {
          text: "The walls lit up—whoooosh!—with glowing symbols. Lines connected like a maze made by lightning. \"Puzzle party!\" Banana grinned. \"Temple, show us what you got.\"",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Connor-banana.png",
          alt: "Team of animals working together on temple puzzles" 
        },
        right: {
          text: "Team time: gorillas shoved mega-blocks, otters slip-slid through tiny tunnels, elephants lifted stones like they were marshmallows. Banana called plays: \"Left! Lift! Otter express!\" Click… clack… KER-CHUNK!",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Connor-banana.png",
          alt: "Ancient door creaking open while elephants block Xuro" 
        },
        right: {
          text: "A door groaned open—creeeeak. Xuro lunged, but elephant butts made a perfect wall. \"Denied,\" said Banana. Xuro hissed, melting into the dark like spilled ink. \"Round two later,\" Banana whispered.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Connor-banana.png",
          alt: "Magnificent golden owl statue with glowing eyes and spread wings" 
        },
        right: {
          text: "They entered a WOW room. A golden owl statue spread huge wings, shiny as sunrise toast. Its eyes glowed—blink!—like twin flashlights. Everyone's mouth did the same thing: O.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Connor-banana.png",
          alt: "The golden owl's head turning as it speaks to the team" 
        },
        right: {
          text: "The owl's head turned with a slow scrape. \"Only true hearts may see the treasure,\" it boomed. Banana stood tall. \"We've got eight brave hearts…and one stylish hat.\"",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Connor-banana.png",
          alt: "Mysterious black crystal pulsing in an opened chest" 
        },
        right: {
          text: "The chest opened itself—snap! No coins. No crowns. Just a black crystal… pulsing. Thump… thump… thump. Torches fizzled out. In the dark, a whisper curled around them: \"Welcome, travelers… I've been waiting.\"",
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
          alt: "A whimsical classroom with floating books and magical elements" 
        },
        right: {
          text: "Miss Willowbrook was not like other teachers. Her classroom had books that floated in mid-air, pencils that wrote by themselves, and a chalkboard that sometimes drew pictures when no one was looking. The students loved her, but the principal was getting suspicious.",
          dropCap: true,
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Gaia-School.png", 
          alt: "Students watching in amazement as their teacher performs magic" 
        },
        right: {
          text: "During math class, Miss Willowbrook would make the numbers dance across the board, solving equations in colorful spirals. For history, she'd wave her hand and the classroom would transform into ancient Rome or medieval England, complete with sounds and smells.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Gaia-School.png", 
          alt: "The principal peeking through the classroom door suspiciously" 
        },
        right: {
          text: "One day, Principal Grumpleton decided to investigate. He crept up to the classroom door and peered through the window. What he saw made his eyes grow wide as saucers: twenty students floating gently in the air, reading books that glowed like lanterns.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Gaia-School.png", 
          alt: "Miss Willowbrook revealing her secret to the principal" 
        },
        right: {
          text: "'I can explain,' said Miss Willowbrook with a twinkle in her eye. 'Learning should be magical, don't you think?' She waved her hand, and suddenly Principal Grumpleton found himself floating too, a big smile spreading across his face for the first time in years.",
          audio: null
        }
      },
      {
        type: "spread",
        left: { 
          image: "/covers/Gaia-School.png", 
          alt: "The whole school enjoying magical learning together" 
        },
        right: {
          text: "From that day forward, Willowbrook Elementary became the most extraordinary school in the world. Students came from far and wide to learn in floating classrooms, where every lesson was an adventure and every day brought new magic.",
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


