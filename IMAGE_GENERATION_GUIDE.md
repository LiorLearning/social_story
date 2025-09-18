# 🎨 Connor's Banana Monkey Storybook - Image Generation Guide

## 📋 Quick Setup
1. Generate images using the prompts below
2. Save images with the specified filenames
3. Place images in `/public/covers/banana-story/` directory
4. Update the image paths in `src/data/storyPages.ts`

## 🖼️ Image Generation Prompts

### Page 1 - Adventure Begins
**Filename:** `banana-page-1.png`
**Prompt:**
```
A whimsical cartoon monkey named Banana the III wearing a bright red Santa hat, winking playfully in a lush Amazon rainforest. Gorillas are thumping their chests in the background, cute otters are waddling around, and majestic elephants are trumpeting. Vines hang like spaghetti from towering trees, with magical mist swirling around that smells of wet leaves and adventure. The scene has a warm, vibrant storybook illustration style with soft lighting and rich jungle greens. Child-friendly cartoon art style, similar to Disney or Pixar animation.
```
**Current Status:** ✅ Already using external image URL

### Page 2 - Temple Interior
**Filename:** `banana-page-2.png`
**Prompt:**
```
Inside an ancient mysterious temple with flickering torches that go "fssst-pop!" casting dancing shadows on stone walls. The walls are carved with intricate reliefs of lions, turtles, and even a whimsical tap-dancing goat. Banana the III (monkey in red Santa hat) holds a glowing lantern, whispering in the atmospheric darkness. The temple feels OLD and mystical with warm torch lighting creating dramatic shadows. Storybook illustration style, adventurous and slightly mysterious but not scary for children.
```

### Page 3 - Xuro Appears
**Filename:** `banana-page-3.png`
**Prompt:**
```
Xuro the jaguar dramatically leaping out from the shadows with teeth gleaming like tiny moons, fierce but not terrifying. The jaguar has beautiful spotted coat and intense green eyes, roaring "The treasure is mine!" Banana the III (monkey in red Santa hat) stands bravely holding his lantern high, looking determined and friendly. The scene shows confrontation but maintains a playful, adventure-story tone. Warm lighting from the lantern, dynamic action pose. Child-friendly storybook art style.
```

### Page 4 - Animal Orchestra
**Filename:** `banana-page-4.png`
**Prompt:**
```
A delightful scene of jungle animals creating a rhythmic symphony: gorillas drumming with their fists (boom-boom beat), massive elephants stomping creating earthquake effects (thud-THUD!), and adorable otters squeaking like rubber ducks. Xuro the jaguar's tail swishes like a jump rope. All animals are animated and expressive, showing the energy and excitement of the moment. Banana the III (in red Santa hat) is in the center orchestrating. Vibrant, musical, joyful storybook illustration with motion lines and sound effects.
```

### Page 5 - Temple Magic
**Filename:** `banana-page-5.png`
**Prompt:**
```
Temple walls dramatically lighting up with glowing magical symbols and intricate maze patterns that connect like lightning bolts. The symbols pulse with ethereal blue and gold light, creating a "whoooosh" effect. Banana the III (monkey in red Santa hat) grins excitedly saying "Puzzle party!" The ancient stone walls are covered in mystical glowing hieroglyphs and geometric patterns. Magical, wonder-filled atmosphere with beautiful lighting effects. Fantasy storybook art that's enchanting but not scary.
```

### Page 6 - Teamwork Puzzle
**Filename:** `banana-page-6.png`
**Prompt:**
```
An exciting teamwork scene showing gorillas pushing massive stone blocks, cute otters slip-sliding through tiny tunnels with determined expressions, and elephants effortlessly lifting enormous stones like marshmallows with their trunks. Banana the III (in red Santa hat) is calling plays like a coach: "Left! Lift! Otter express!" The scene shows mechanical puzzle elements clicking into place (click-clack-KER-CHUNK!). Dynamic action with all animals working together harmoniously. Bright, energetic storybook illustration.
```

### Page 7 - Door Opens
**Filename:** `banana-page-7.png`
**Prompt:**
```
An ancient massive stone door creaking open with dramatic "creeeeak" sound effects. Xuro the jaguar is lunging forward aggressively, but a hilarious wall of elephant butts blocks his path perfectly. Banana the III (monkey in red Santa hat) says "Denied" with a cheeky grin. Xuro hisses and melts into the dark shadows like spilled ink, creating mysterious silhouettes. The scene is both dramatic and humorous, with the door revealing mysterious darkness beyond. Adventure storybook art with comedic timing.
```

### Page 8 - Golden Owl Discovery
**Filename:** `banana-page-8.png`
**Prompt:**
```
A breathtaking WOW moment showing a magnificent golden owl statue with enormous spread wings that shine like sunrise toast. The owl's eyes glow brilliantly like twin flashlights, creating dramatic beams of light. All the animals (gorillas, elephants, otters, and Banana the III in his red Santa hat) have their mouths open in perfect "O" shapes of amazement. The chamber is grand and awe-inspiring with golden light reflecting everywhere. Majestic, wonder-filled storybook illustration with dramatic lighting and sense of discovery.
```

### Page 9 - Owl's Challenge
**Filename:** `banana-page-9.png`
**Prompt:**
```
The golden owl statue's head turning with a slow, mechanical scraping sound, its glowing eyes fixed on the group. The owl speaks with authority: "Only true hearts may see the treasure." Banana the III (monkey in red Santa hat) stands tall and proud, chest puffed out confidently, declaring "We've got eight brave hearts...and one stylish hat." The other animals (gorillas, elephants, otters) stand behind him supportively. Dramatic but warm lighting, showing courage and friendship. Noble, inspiring storybook art style.
```

### Page 10 - Crystal Mystery
**Filename:** `banana-page-10.png`
**Prompt:**
```
A mysterious treasure chest opening by itself with a dramatic "snap!" revealing not coins or crowns, but a mesmerizing black crystal that pulses with an otherworldly rhythm (thump-thump-thump). The torches around the chamber are fizzling out one by one, creating growing darkness. In the shadows, ethereal whispers curl around the group: "Welcome, travelers... I've been waiting." The crystal emanates a subtle dark energy. All animals look intrigued but slightly uncertain. Mysterious, cliffhanger atmosphere with dramatic lighting. Storybook art that's intriguing but not frightening.
```

## 🔧 Integration Instructions

### Step 1: Create Directory
```bash
mkdir -p /Users/tilakrajsingh/Desktop/social_story/public/covers/banana-story/
```

### Step 2: Generate Images
Use any AI image generator (DALL-E 3, Midjourney, Stable Diffusion) with the prompts above.

### Step 3: Save Images
Save each generated image with the corresponding filename in the directory created above.

### Step 4: Update storyPages.ts
Replace the TODO comments in `src/data/storyPages.ts` with the new image paths:

```javascript
// Replace this:
image: "/covers/Connor-banana.png", // TODO: Replace with generated image for Page 2

// With this:
image: "/covers/banana-story/banana-page-2.png",
```

## 📱 Quick Update Script
Once you have all images generated, you can use this find-and-replace pattern:

**Find:** `/covers/Connor-banana.png", // TODO: Replace with generated image for Page X`
**Replace:** `/covers/banana-story/banana-page-X.png",`

## 🎨 Style Guidelines
- **Art Style:** Child-friendly cartoon/storybook illustration
- **Color Palette:** Warm, vibrant colors with good contrast
- **Character Consistency:** Banana the III always wears his red Santa hat
- **Mood:** Adventurous, magical, but never scary or dark
- **Resolution:** Recommend 1024x1024 or higher for crisp display

## ✅ Checklist
- [ ] Generate Page 2 image (Temple Interior)
- [ ] Generate Page 3 image (Xuro Appears)
- [ ] Generate Page 4 image (Animal Orchestra)
- [ ] Generate Page 5 image (Temple Magic)
- [ ] Generate Page 6 image (Teamwork Puzzle)
- [ ] Generate Page 7 image (Door Opens)
- [ ] Generate Page 8 image (Golden Owl Discovery)
- [ ] Generate Page 9 image (Owl's Challenge)
- [ ] Generate Page 10 image (Crystal Mystery)
- [ ] Update storyPages.ts with new image paths
- [ ] Test storybook reader with new images

